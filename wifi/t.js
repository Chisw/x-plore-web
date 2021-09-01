
function log(n) {
   console.log(n);
}
function dir(o){
   console.dir(o);
}

function de(ev){
//   dir(ev);
   log(ev.type);
}


function onReady(){
//   log("rd");
   
//   dir(v);
//   log(typeof v);

   /*
   var v = $("#vid");
   var evs = "canplay error loadstart loadedmetadata loadeddata playing waiting ended play pause emptied progress";
   v.on(evs, function(e){
      log("V: "+e.type);
//      dir(e)
   });
   var src = $('<source src="LM.avi" type="video/avi">');
//   var src = $('<source src="LM.mp4" type="video/mp4">');
   src.on(evs, function(e){
      log(e.type);
//      dir(e)
   });
   v.append(src);
   */
   
//   flashObject();
   log("! "+$.browser.version);
}

function flashObject(){
   var url = "../LM.mp4";
   htmlcode = 
      '<embed type="application/x-shockwave-flash" width="400" height="300" allowscriptaccess="always" allowfullscreen="true" bgcolor="#f00" '+
         'flashvars='+
//         '"fichier='+url+'&apercu=img/imgv_next.png" '+
//         'src="flash/v1_14.swf" '+
         '"skin=flash/f4skin1.swf&video='+url+'" '+
         'src="flash/f4player1.swf" '+
         
         '/>';
   var f = $(htmlcode);
   $("#ppp").append(f);
   
   //dir($("#ppp embed"))
}



function vidErr(e){
}

function testBut(){

}