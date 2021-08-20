function dest(queryData) {
    data = [];
   queryData.forEach(function(d){
       data.push(d);
   });

    return data;
}

module.exports = {
    dest
};