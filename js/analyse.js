// mt Created with Python 2.x on 2011-11-08
// sch Translated into js on 2020-01-17

function readRules(lines) {
    // 将规则读取到词典中，并在此过程中统计规则条数以及判断有无重复规则
    // 参　数： lines 已打开的文件对象
    // 返回值： 存放规则及统计结果的列表
    var rules_dic = {};  // 为便于判断是否有重复规则，将规则存入词典
    var line_num = 0;    // 记录行号
    var rules_num = 0;   // 记录规则数
    var rules = [];      // 返回结果值的列表["father left right lin_num",……]

    for (let m in lines) {
        let line = lines[m].replace(/([\n\r\s\t]+)/g,' ').trim();
        line_num = line_num + 1;  // 记录行号加1
        let comment_pos = line.search(/;/);
        if (comment_pos >= 0) {
            line = line.slice(0, comment_pos).trim();  // 把;前的字符取出来
        }
        let r = line.split(" ");
        let rule = "";
        if (r.length > 0 && r[0][0] != ";" && r[0][0] != undefined){
            // console.log(r[0][0]);
            rules_num += 1;  // 记录规则条数加1
        }
        let i = 0;
        while (i < r.length) {
            if (r[i][0] == ";" || r[i][0] == undefined) {
                break;  // 遇见注释标记“;”（或者空行），对之后的内容予以忽略
            } else {
                rule = rule + " " + r[i];
            }
            i += 1;
        }
        if (rule.length > 0){
            if (rule in rules_dic) {
                rules_dic[rule].push(line_num.toString(10));
            } else {
                rules_dic[rule] = [line_num.toString(10)];
            }
        }
    }
    var result = "共有 " + rules_num.toString(10) + " 条规则";  // 打印结果，存入规则列表尾

    let chong_num = 0;
    let chong = "";
    for (let j_ in Object.keys(rules_dic)){  // 根据规则出现的行判断有无规则重复出现
        let j = Object.keys(rules_dic)[j_];
        if (rules_dic[j].length > 1){
            chong_num = chong_num + rules_dic[j].length;
            for (let a_ in rules_dic[j]) {
                let a = rules_dic[j][a_];
                chong = chong + "行" + a + " ";
            }
            chong = "规则 " + j + " 重复：" + chong + "\n\n";
            rules.push(j + " " + (rules_dic[j][0]).toString(10) );  // 将规则和行数放入结果列表
        } else {
            rules.push(j + " " + (rules_dic[j][0]).toString(10) );  // 将规则和行数放入结果列表
        }
    }
    if (chong_num > 0) {
        result = result + "，其中有" + (chong_num).toString(10)  + "条规则重复出现，具体如下：\n" + chong;
    } else {
        result = result + "，没有重复出现的规则\n\n";
    }

    rules.push(result);  // 将规则统计结果放入列表最后

    return rules
}


function AnalyseRules(rules) {
    // 对规则进行分析，得到各符号的分布环境
    // 参　数： rules 规则列表
    // 返回值： 存储各符号分布环境的词典
    // 　　　　 格式为{规则符号:[left_num, [father,left,right,line_num],[……]],……}
    var all_env = {};
    rules = rules.slice(0,-1);  // 去掉存储统计结果的最后一项
    for (let rule_ in rules) {
        let rule = rules[rule_];
        let t = rule.trim().split(" ");
        // console.log(t);
        let i = 0;
        while (i < t.length - 1) {
            if (! (t[i] in all_env) && i != 1) {  // 规则符号第一次出现，初始化词典
                all_env[t[i]] = [0];  // 列表的第一项存放规则符号在规则左边出现的次数
            }
            if (i == 0) {
                all_env[t[i]][0] = all_env[t[i]][0] + 1
            } else if (i == 1) {
                i += 1;
                continue;
            } else if (i == 2) {
                if (i == t.length - 2){
                    e = [t[0],"NULL","NULL",t[t.length-1]];  // 在元组中存放规则符号在此条规则下的分布环境
                }
                else {
                    e = [t[0],"NULL",t[i+1],t[t.length-1]];  // 在元组中存放规则符号在此条规则下的分布环境
                }
                all_env[t[i]].push(e);
            } else {
                if (i == t.length - 2){
                    e = [t[0],t[i-1],"NULL",t[t.length-1]];  // 在元组中存放规则符号在此条规则下的分布环境
                }
                else {
                    e = [t[0],t[i-1],t[i+1],t[t.length-1]];  // 在元组中存放规则符号在此条规则下的分布环境
                }
                all_env[t[i]].push(e);
            }
            i += 1;
        }
    }
    return all_env;
}


function GetTerminator(all_env) {
    // 通过各符号的分布环境得到终结符及其个数
    // 参　数： all_env 存储所有规则符号分布环境的词典
    // 返回值： 存储规则终结符的列表
    return Object.keys(all_env).filter(t=>{return all_env[t][0]==0});
}


function GetNonTerminator(all_env) {
    // 通过各符号的分布环境得到非终结符及其个数
    // 参　数： all_env 存储所有规则符号分布环境的词典
    // 返回值： 存储规则终结符的列表
    return Object.keys(all_env).filter(t=>{return all_env[t][0]!=0});
}


function GetNonTerEnv(all_env) {
    var nter = arguments[1] ? arguments[1] : GetNonTerminator(all_env);
    // 查询非终结符分布环境
    // 参　数： all_env 存储所有规则符号分布环境的词典；nter 要查询的非终结符列表，若为空，则打印全部非终结符环境
    // 返回值： 各终结符分布环境词典
    if (nter == []) {
        nter = GetNonTerminator(all_env);
    } else {
        var error = nter.filter(t=>{return ( GetNonTerminator(all_env).indexOf(t)==-1 )});
        nter = nter.filter(t=>{return ( GetNonTerminator(all_env).indexOf(t)!=-1 )});
        // var error = [t for t in nter if not t in GetNonTerminator(all_env)];
        // nter = [t for t in nter if t in GetNonTerminator(all_env)];
        if (error.length != 0) {
            for (t in error) {
                console.log(t + "不是规则中出现过的非终结符");
            }
        }
    }
    if (nter.length == 0) {
        console.log("\n您没有输入任何合法的非终结符，查询失败\n");
    }


    var dct = {};
    nter.forEach(t=>{ dct[t]=all_env[t]; });

    return dct;
    // return dict([(t,all_env[t])for t in nter])
}


function CountNonTer(nt_env){
    // 统计非终结符出现次数
    // 参　数： nt_env 特定非终结符分布环境的词典
    // 返回值： 存放了出现次数的词典
    var dct = {};
    Object.keys(nt_env).forEach(t=>{ dct[t]=nt_env[t].length-1; });
    return dct;
    // return dict(([t,len(nt_env[t])-1]) for t in nt_env.keys());
}


function SortNonTer(nt_env){
    var order = arguments[1] ? arguments[1] : true;
    // 按照出现次数对非终结符进行排序
    // 参　数： nt_env 特定非终结符分布环境的词典；order True 升序 False 降序
    // 返回值： 排序完毕的列表
    let nt_count = CountNonTer(nt_env);
    // console.log(nt_count);
    let l = [];
    Object.keys(nt_count).forEach(k=>{l.push([k,nt_count[k]]);})
    // l = [(k,nt_count[k])for k in nt_count.keys()]
    if (order) {
        l.sort( (a,b) => a[1]>b[1] );
    } else {
        l.sort( (a,b) => a[1]<b[1] );
    }
    let ll = [];
    l.forEach(b=>{ll.push(b[0]);});
    return ll;
    // return [b[0] for b in l]
}





// def IfEnvSame(all_env):
//     // 查找是否存在两个非终结符的分布环境一样
//     // 参　数： all_env 存储所有规则符号分布环境的词典
//     // 返回值： NULL
//     dir = {}
//     result = ""
//     for t in GetNonTerminator(all_env):
//         i = 1
//         while i < len(all_env[t]):
//             a = all_env[t][i][0:-1]
//             if not a in dir:
//                 dir[a] = [t]
//             else:
//                 if not t in dir[a]:
//                     dir[a].append(t)
//             i = i + 1
//     for t in dir.keys():
//         if len(dir[t]) > 1:
//             i = 0
//             nt = ""
//             while i < len(dir[t]):
//                 nt = nt + dir[t][i] + " "
//                 i = i + 1
//             result = result + "非终结符" + nt + "存在相同的分布环境：" + t[0] + " -> " + t[1] + " * " + t[2] + "\n\n"
//     if len(result) == 0:
//         print "规则中不存在分布环境相同的非终结符"
//     else:
//         out_file_name = "SameEnv_" + lines_name
//         out_file = open(out_file_name,"w")
//         sorted_result = []
//         sorted_result = result.split("\n\n")
//         sorted_result.sort()
//         i = 0
//         while i < len(sorted_result): 
//             out_file.write(sorted_result[i])
//             out_file.write("\n")
//             i = i + 1
//         out_file.close()
//         print "规则中存在分布环境相同的非终结符,详细分析结果已打印到结果文件" + out_file_name




// def PrintNonTerEnvToTxt(nt_env):
//     #打印非终结符分布环境到txt
//     #参数：nt_env 特定非终结符分布词典
//     #返回值：NULL
//     if len(nt_env.keys()) == 0:
//         return
    
//     width = -20
//     width_choice = raw_input("是否改变存放分布环境表格的列宽？1、是 2、否(当前列宽为20字符，左对齐)\n")
//     if int(width_choice) == 1:
//         width = int(raw_input("请输入新的表格列宽(负数为左对齐，正数为右对齐)\n"))

//     out_file_name = "nt_env_" + lines_name
//     out_file = open(out_file_name, "w")

//     #打印表头
//     output = "%*s%*s%*s%*s%*s%*s\n"%(width, "非终结符", width, "分布次数", width, "父节点", width, "左邻节点", width, "右邻节点", width, "出现行号") + "\n"

//     #打印内容
//     nt_count = CountNonTer(nt_env)
//     for t in SortNonTer(nt_env):
//         j = 1
//         a = nt_env[t]
//         while j < len(a):
//             output = output + "%*s%*s%*s%*s%*s%*s\n"%(width, t ,width, nt_count[t], width, str(a[j][0]), width, str(a[j][1]), width, str(a[j][2]), width, str(a[j][3]))
//             j = j + 1
//     out_file.write(output)
    
//     out_file.close() 
    
//     print "您所查询的非终结符的分布环境已打印到结果文件 " + out_file_name + "\n"












// if __name__ == '__main__':
//     in_file = fun.ReadFile()         #打开规则文件
    
//     output = "#CFG文法规则分析报告——Overview\n"
//     output = output + "#Rules Filename:" + fun.in_file_name + "\n"
//     output = output + "#Created Time:" + time.strftime('%Y-%m-%d', time.gmtime()) + "\n\n"
    
//     rules = fun.ReadRules(in_file)   #读取规则，统计规则条数及判断是否有重复规则
//     i = len(rules) - 1
//     output = output + "您要分析的规则文件“" + fun.in_file_name + "”中" + rules[i]
    
//     env = fun.AnalyseRules(rules) #对已读取的规则进行分析
    
//     ter = fun.GetTerminator(env)  #获取终结符及其个数
//     output = output + "终结符个数为：" + str(len(ter)) + ",具体如下：\n"  
//     for t in ter:
//         output = output + t + " || "
//     output = output.rstrip(" || ")
        
//     nter = fun.GetNonTerminator(env)   #获取非终结符及其个数
//     output = output + "\n\n非终结符个数为：" + str(len(nter)) + ",具体如下：\n"  
//     for t in nter:
//         output = output + t + " || "
//     output = output.rstrip(" || ")
//     output = output + "\n\n"
    
//     #将总体报告打印到结果文件中
//     out_file_name = "overview_" + fun.in_file_name
//     out_file = open(out_file_name,"w")
//     out_file.write(output)
//     out_file.close()
    
//     print("规则文件的总体报告已生成\n（内容包括规则总条数、是否有重复的规则、终结符及其个数以及非终结符及其个数），\n请打开文件" + out_file_name + "进行查看\n")
    
//     while True:
//         choice = raw_input("""请选择您接下来的操作：
//         1、查询非终结符分布环境，并将结果打印到excel文件中；
//         2、查询非终结符分布环境，并将结果打印到txt文本文件中：
//         3、分析规则中是否有分布环境相同的非终结符：
//         4、退出\n""")
        
//         if int(choice) == 4:
//                 break
//         if int(choice) == 1 or int(choice) == 2:
//             nt = raw_input("请输入您要查询的非终结符,不同非终结符以空格隔开,输入为空将打印所有非终结符分布环境\n")
//             nt = nt.split()
//             if int(choice) == 1:
//                 fun.PrintNonTerEnvToExcel(fun.GetNonTerEnv(env, nt))
//             else:
//                 fun.PrintNonTerEnvToTxt(fun.GetNonTerEnv(env, nt))
//             raw_input("Press Enter to back ^_^\n")
//         elif int(choice) == 3:
//             output = fun.IfEnvSame(env)
//             raw_input("Press Enter to back ^_^\n")















































