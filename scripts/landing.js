var animatePoints = function() {
  
    var points = getElementByClassName('point');
    
   
    
    for(var i=0; i < points.length; i ++) 
    
    var revealPoint = function (i) {
    points[i].style.opacity = 1;
    points[i].style.transform = "scaleX(1) translateY(0)";
    points[i].stylemsTransform = "scaleX(1) translateY(0)";
    points[i].styleWebkitTransform = "scale(1) translateY(0)";
    };
        revealPoint();
   };  
      

animatePoints();