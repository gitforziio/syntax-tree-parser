
function treeParser(t) {
    //S[S1_SR[1Thead_n[1T[_1[一],te[十]],_n[_u[九]]],wa[万],Rr[_u[六]]]]
    //S:[S1_SR:[1Thead_n:[1T:[_1:[一],te:[十]],_n:[_u:[九]]],wa:[万],Rr:[_u:[六]]]]
    //S[    S1_SR[   1Thead_n[  1T[ _1[一] , te[十] ] , _n[ _u[九] ]  ] , wa[万] , Rr[ _u[六] ]   ]    ]
    //{"name":"S","children":[  ]}

    t = `${t.trim().replace(/([\n\r\s\t]+)/g,' ')}`;
    let t_0 = `${t.replace(/([\{\(])/g,'[').replace(/([\}\)])/g,']').replace(/([\:])/g,'_')}`;
    let t_1 = t_0.replace(/\[/g,":[");
    console.log(t_1);
    let t_2 = `${t_1.replace(/([^\[\]:\n\s\t,]+)/g,'"$1"')}`;
    console.log(t_2);
    let t_p = `${t_2.replace(/("[^":]+"):/g,'{$1:').replace(/(\])/g,'$1}')}`;
    console.log(t_p);

    let t_j = JSON.parse(t_p);
    console.log(t_j);



    function make(j,o) {// j is an object
        if (o == undefined) {o={};};
        // console.log("【MAKING】");
        let ks = Object.keys(j);
        for (let i in ks) {
            let name = ks[i];
            o.name = name;
            let children = [];
            let children_fake = j[name];// this is an array or string
            children.length = children_fake.length;
            o.children = children;
            for (let n in children_fake) {
                child_fake = children_fake[n];// this is an object
                // console.log(child_fake);
                // console.log(o.children[n]);
                if (typeof(children_fake[n])=='string') {
                    child = {"name": children_fake[n]};
                    children[n]=child;
                } else {
                    child = make(child_fake,o.children[n]);
                    children[n]=child;
                }
                // console.log(child);
            }
            o.children = children;
        }
        // console.log("【MADE】");
        return o;
    }

    return make(t_j);

}



function createTree(data) {

    let width = 600;

    let tree = data =>{
        const root = d3.hierarchy(data);
        root.dx = 16;
        root.dy = width / (root.height + 1);
        return d3.cluster().nodeSize([root.dx,root.dy])(root);
    }

    const root = tree(data);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    const svg = d3.create('svg')
        .attr("viewBox", [-60, -20, width+20, x1 - x0 + root.dx * 2+40]);
        ;

    // const svg = d3.select('#the_svg_wrap').append('svg').attr("id","the_svg")
    //     .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
    //     ;

    const g = svg.append('g')
        .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`)
        ;

    const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
    .selectAll("path")
        .data(root.links())
        .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
        ;

    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        ;

    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5)
        ;

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
    .clone(true).lower()
        .attr("stroke", "white")
        ;

    return svg.node();

}


function drawTree(wrap,data) {
    d3.select(wrap).node().appendChild(createTree(data));
}


































