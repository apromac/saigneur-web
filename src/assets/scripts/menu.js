$(function(){
  $("dl").click(function(){
    console.log('dl clicked');
    $(this).toggleClass("open");
    if($(this).hasClass("open"))
      $("dt").not(this).removeClass("open");
  })
});
