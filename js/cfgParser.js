
function ruleFormater(t) {

    t = `${t.replace(/([\n\r\s\t]+)/g,' ').trim()}`;

    let rule = {left : '', right : [], note : '' , only_note : false}

    let only_note = t.match(/(^;.*)/);
    if (only_note) {
        if (only_note[1]) {
            let x = only_note[1].trim();
            rule.note = x[0]==';'?x.slice(1).trim():x;
            rule.only_note = true;
        }
    } else {
        let left_thing = t.match(/(^.+)->/);
        if (left_thing) {
            if (left_thing[1]) {
                rule.left = t.match(/(^.+)->/)[1].trim();
            }
        }

        let right_and_note = t.match(/->([^;]+)(;.*)?/);
        if (right_and_note) {
            if (right_and_note[1]) {
                rule.right = right_and_note[1].trim().split(' ');
            }
            if (right_and_note[2]) {
                let x = right_and_note[2].trim();
                rule.note = x[0]==';'?x.slice(1).trim():x;
            }
        }
    }

    // console.log(rule);
    return rule;
}


function rules(txt) {
    let l = txt.trim().split(/[\n]+/);
    // console.log(l);
    let rs = [];
    l.forEach(t=>{
        if(t.trim().replace(/([\n\r]+)/g,' ').trim()){
            // console.log(t);
            rs.push(ruleFormater(t));
        }
    });


    console.log(rs);
    return rs;
}


function rulePrinter(r,withnote) {
    let right_text ='';
    r.right.forEach(x=>{right_text+=x+' ';});
    right_text = right_text.trim();
    if (withnote) {
        return `${r.left}${r.left?" -> ":""}${right_text}${r.note?'; '+r.note:''}${((r.only_note)&&(!r.note))?";":""}`;
    } else {
        return `${r.left}${r.left?" -> ":""}${right_text}`;
    }
    
}





