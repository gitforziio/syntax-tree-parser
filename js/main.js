
function treeFormater(t) {
    //S[S1_SR[1Thead_n[1T[_1[一],te[十]],_n[_u[九]]],wa[万],Rr[_u[六]]]]
    //S:[S1_SR:[1Thead_n:[1T:[_1:[一],te:[十]],_n:[_u:[九]]],wa:[万],Rr:[_u:[六]]]]
    //S[    S1_SR[   1Thead_n[  1T[ _1[一] , te[十] ] , _n[ _u[九] ]  ] , wa[万] , Rr[ _u[六] ]   ]    ]
    //{"name":"S","children":[  ]}

    t = `${t.trim().replace(/([\n\r\s\t]+)/g,' ')}`;
    t = `${t.trim().replace(/(,+)/g,',')}`;

    let t_0 = `${t.replace(/([\{\(])/g,'[').replace(/([\}\)])/g,']').replace(/([\:])/g,'_')}`;
    t_0 = `${t_0.trim().replace(/^\[(.+)\]$/,'$1')}`;

    let t_1 = t_0.replace(/\[/g,":[");
    console.log(t_1);

    let t_2 = `${t_1.replace(/([^\[\]:\n\s\t,]+)/g,'"$1"')}`;
    let l_a = t_2.match(/\[/g), n_a = !l_a ? 0 : l_a.length;
    let l_b = t_2.match(/\]/g), n_b = !l_b ? 0 : l_b.length;
    let n_x = n_a-n_b;
    if (n_x>0) {t_2+=(']'.repeat(n_x));};
    console.log(t_2);

    let t_p = `${t_2.replace(/("[^":]+"):/g,'{$1:').replace(/(\])/g,'$1}')}`;
    console.log(t_p);

    return t_p;
}



function treeParser(t_p) {

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

    let width = 200;

    let tree = data =>{
        const root = d3.hierarchy(data);
        // root.dx = 16;
        root.dx = 64;
        root.dy = width / (root.height + 1);
        // return d3.tree().nodeSize([root.dx,root.dy])(root);
        return d3.cluster().nodeSize([root.dx,root.dy])(root);
    }

    const root = tree(data);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    const svg = d3.create('svg').attr("class","svg_tree")
        // .attr("viewBox", [-60, -20, width+20, x1 - x0 + root.dx * 2+40]);
        .attr("viewBox", [-20, -20, x1 - x0 + root.dx * 2+40, width+60]);
        ;

    // const svg = d3.select('#the_svg_wrap').append('svg').attr("id","the_svg")
    //     .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
    //     ;

    const g = svg.append('g')
        // .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`)
        .attr("transform", `translate(${root.dx - x0},${root.dy / 3})`)
        ;

    const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#666")
        .attr("stroke-opacity", 0.25)
        .attr("stroke-width", 1.5)
    .selectAll("path")
        .data(root.links())
        .join("path")
            // .attr("d", d3.linkHorizontal()
            //     .x(d => d.y)
            //     .y(d => d.x))
            // .attr("d", d3.linkVertical()
            //     .x(d => d.x)
            //     .y(d => d.y))
            .attr("d", d=>`M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`)
        ;

    const node = g.append("g")
        // .attr("stroke-linejoin", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
        // .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("transform", d => `translate(${d.x},${d.y})`)
        ;

    node.append("circle")
        .attr("fill", d => d.children ? "#666" : "#999")
        .attr("fill-opacity", 0.25)
        .attr("r", 2.5)
        ;

    node.append("text")
        // .attr("dy", "0.31em")
        .attr("dy", d => d.children ? "0.2em" : "1.2em")
        // .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", "middle")
        // .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        // // .attr("textLength", d=>{return d.data.name.length>6?64:null})
        // .attr("textLength", d=>{console.log(d);console.log(this);return d.node().getBoundingClientRect().width>d.dx?d.dx:null})
        // .attr("lengthAdjust", d=>{return d.data.name.length>6?"spacingAndGlyphs":"spacing"})
        .attr("stroke", "white")
        .attr("stroke-width", 2)
    .clone(true)//.lower()
        // .attr("stroke", "red")
        .attr("stroke", "transparent")
        .attr("stroke-width", 0)
        ;

    // svg.selectAll("text").nodes()
    //     .forEach(e=>{
    //         console.log(e);
    //         let w = e.getBBox().width;
    //         console.log(w);
    //         d3.select(e)
    //             .attr("textLength", d=>{return w>d.dx?d.dx:null})
    //             .attr("lengthAdjust", d=>{return w>d.dx?"spacingAndGlyphs":"spacing"})
    //             ;
    //     });

    return svg.node();

}


function drawTree(wrap,data) {
    d3.select(wrap).node().appendChild(createTree(data));
}


































