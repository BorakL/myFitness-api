const setSortParam = (req)=>{
    let sortObj={}
    if(req.query.sort[0]==="-"){
        sortObj[req.query.sort.substring(1)]=-1
    }else{
        sortObj[req.query.sort]=1
    }
    return sortObj;
}

module.exports = setSortParam;