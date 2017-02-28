exports.mensaje = function(){
    console.log("mensaje exports");
};

/*
module.exports = function(){
    console.log("mensaje module exports");
};*/

module.exports = {
    mensaje:function(){
        console.log("mensaje module exports");
    }
};
