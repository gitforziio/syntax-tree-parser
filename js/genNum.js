
function times(str, num){
    num = Math.round(num);
    return num >= 1 ? str += times(str, --num): '';
}

function genNumWithoutZero(n) {
    n = Math.round(n);
    let nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let t = '';
    for (var i = n - 1; i >= 0; i--) {
        t += nums[Math.floor(Math.random()*9)];
    }
    return t;
}

function joinZero(t,x) {
    x = Math.round(x);
    let l = t.length;
    if (x) {
        if (x > t.length) {
            x = t.length;
        } else if (x < 1) {
            x = 1;
        }
        t = t.slice(0,t.length-x)+'0'+t.slice(t.length-x+1,t.length);
    }
    return t;
}

function genNumWithZero(n,x) {
    n = Math.round(n);
    x = Math.round(x);
    let t = genNumWithoutZero(n);
    return joinZero(t,x);
}

function randomNumStr(n) {
    n = Math.round(n);
    let t = genNumWithoutZero(1);
    for (let i = 1; i <= n; i++) {
        t += (i==1)?(""):(Math.floor(Math.random()*10).toString(10));
    }
    return t;
}

function random_0_1_grid(n) {
    n = Math.round(n);
    let t = "1";
    for (let i = 1; i <= n; i++) {
        t += (i==1)?(""):(Math.floor(Math.random()*2).toString(10));
    }
    return t;
}

function random_0_Num_grid(n) {
    n = Math.round(n);
    let t = random_0_1_grid(n);
    let stop = false;
    while (!stop) {
        t = t.replace(/1/i,'y');
        t = t.replace(/y/i,`${Math.floor(Math.random()*9)+1}`);
        if (t.search(/1/i)==-1) {stop = true;}
    }
    return t;
}

function smart_0_1_grid(n) {
    n = Math.round(n);
    let t = "1";
    for (let i = 1; i <= n; i++) {
        let x = (Math.random()>0.2)?("0"):("1");
        t += (i==1)?(""):(x);
    }
    return t;
}

function smart_0_Num_grid(n) {
    n = Math.round(n);
    let t = smart_0_1_grid(n);
    let stop = false;
    while (!stop) {
        t = t.replace(/1/i,'y');
        t = t.replace(/y/i,`${Math.floor(Math.random()*9)+1}`);
        if (t.search(/1/i)==-1) {stop = true;}
    }
    return t;
}

function gen_0_1_grid(n) {
    n = Math.round(n);
    let grid = [];
    let top02 = times('1', n);
    let btm02 = `1${times('0', n-1)}`;
    let top10 = parseInt(top02, 2);//.toString(10);
    let btm10 = parseInt(btm02, 2);//.toString(10);
    for (let i = btm10; i <= top10; i++) {
        let ii = parseInt(i, 10).toString(2);
        let iii = ii.replace(/1/g,'x');
        grid.push(iii);
    }
    return grid;
}

function gen_0_Num_grid(n) {
    n = Math.round(n);
    let grid = [];
    let gg = gen_0_1_grid(n);
    gg.forEach(t=>{
        let stop = false;
        while (!stop) {
            t = t.replace(/x/i,'y');
            t = t.replace(/y/i,`${Math.floor(Math.random()*9)+1}`);
            if (t.search(/x/i)==-1) {stop = true;}
        }
        grid.push(t);
    });
    return grid;
}

function gen_Nums_grid(n) {
    n = Math.round(n);
    var m = arguments[1] ? arguments[1] : 1;
    if (m < n) {
        let o = n;
        n = m;
        m = o;
    }
    let grid = [];
    for (var i = n; i <= m; i++) {
        let gg = gen_0_Num_grid(i);
        grid.push(...gg);
    }
    return grid;
}

function splitNumStr(nstr) {
    var xx = arguments[1] ? arguments[1] : 4;
    var filler = arguments[2] ? arguments[2] : "";
    nstr = nstr.toString(10);
    let leth = nstr.length;
    let mm = leth % xx;
    nstr = `${times("T",(4-mm)%4)}${nstr}`;
    let ll = nstr.replace(/(.{4})/g,'$1,').split(',');
    ll[0] = ll[0].replace(/T/g,filler);
    return ll.slice(0,-1);
}

function transQian(nstr) {
    let leth = nstr.length;
    let mm = leth % 4;
    nstr = `${times("空",(4-mm)%4)}${nstr}`;
    var zis = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    for (let i in zis) {
        let reg = new RegExp(i.toString(10),"g");
        nstr = nstr.replace(reg,zis[i]);
    }
    var nobj = {
        q:nstr[0],
        b:nstr[1],
        s:nstr[2],
        g:nstr[3]
    };
    let t = `${nobj.q}千${nobj.b}百${nobj.s}十${nobj.g}`;

    t = t.replace(/(零千|零百|零十)/g,"零");
    t = t.replace(/(零+)/g,"零");
    t = t.replace(/(.)零$/,"$1");

    t = t.replace(/(空千|空百|空十)/g,"空");
    t = t.replace(/(空+)/g,"空");
    t = t.replace(/(^空)/g,"");

    // t = t.replace(/(.)/g,"$1 ").trim();
    return t;
}

function transBox(box) {
    let thing = [];
    let le = box.length;
    box.forEach((b,i)=>{
        let t = transQian(b);
        thing.push(t);
        thing.push(`【【${le-1-i}】】`);
    })
    let tt = thing.join('').replace(/(.)零$/,"$1");
    // return tt;
    return transBigWei(tt);
}


function transBigWei(t) {
    var method = arguments[1] ? arguments[1] : 'wanyiiyii';

    if (method=='fo') {
        var bigweis = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
        for (let i in bigweis) {
            let reg = new RegExp(`【【${i}】】`,"g");
            t = t.replace(reg,bigweis[i]);
        }
    } else
    if (method=='wanwanwan') {
        t = t.replace(/【【0】】/,'');
        t = t.replace(/【【\d+】】/g,'万');
        t = t.replace(/零万/g,'万');
        t = t.replace(/(.)零$/,"$1");
    } else
    if (method=='wanwanyii') {
        t = t.replace(/【【0】】/,'');
        t = t.replace(/【【1】】/,'万');
        t = t.replace(/【【2】】/,'亿');
        t = t.replace(/【【\d+】】/g,'万');
        t = t.replace(/亿零万/g,'亿零');
        t = t.replace(/万零万/g,'万万');
        t = t.replace(/(零+)/g,"零");
        // t = t.replace(/万万/g,'亿');
        // t = t.replace(/零亿/g,'零');
        t = t.replace(/(.)零$/,"$1");
    } else
    if (method=='wanyiiyii') {
        t = t.replace(/【【0】】/,'');
        // console.log(t);
        var n = t.match(/【【\d+】】/g).length;
        // console.log(n);
        if (n>0) {
            for (i=1;i<=n;i++) {
                t = (i%2==1)?(t.replace(`【【${i}】】`,'万')):(t.replace(`【【${i}】】`,'亿'));
            }
            t = t.replace(/亿零万/g,'亿零');
            t = t.replace(/(零+)/g,"零");
            t = t.replace(/零亿/g,'亿');
            t = t.replace(/(零+)/g,"零");
            t = t.replace(/(.)零$/,"$1");
        }
    }


    t = t.replace(/([亿万]+)/g,"【$1】");
    return t;
}



// gr=gen_Nums_grid(10,10);
// gr.forEach(g=>{
//   x = transBox(splitNumStr(g));
//   console.log(x);
// })

for (let i = 1; i <= 20; i++) {
    let n = Math.floor(Math.random()*22)+19;
    let x = transBox(splitNumStr(smart_0_Num_grid(n)));
    console.log(x);
}




























































