
function ruleFormater(t) {

    t = `${t.replace(/([\n\r\s\t]+)/g,' ').trim()}`;

    let rule = {left : '', right : [], note : '' }

    if (t.match(/(^.+)->/)[1]) {rule.left = t.match(/(^.+)->/)[1].trim();};
    let right_and_note = t.match(/->([^;]+)(;.*)?/);
    if (right_and_note[1]) {rule.right = right_and_note[1].trim().split(' ');};
    if (right_and_note[2]) {
        let x = right_and_note[2].trim();
        rule.note = x[0]==';'?x.slice(1).trim():x;
    };


    console.log(rule);
    return rule;
}


function rules(txt) {
    let l = txt.trim().split(/[\n]+/);
    console.log(l);
    let rs = [];
    l.forEach(t=>{if(t){rs.push(ruleFormater(t))};});


    console.log(rs);
    return rs;
}


function rulePrinter(r) {
    let right_text ='';
    r.right.forEach(x=>{right_text+=x+' ';});
    right_text = right_text.trim();
    return `${r.left} -> ${right_text}${r.note?'; '+r.note:''}`
}





