var scanner = null;
var activeCameraId = null;
var enEntornoMovil = false;

function Acceder() {  
  var myNode = document.getElementById('scanUL');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  document.getElementById('btnAcceso').style.display='none';
  if (enEntornoMovil) {
    document.getElementById('camara').style.display='block';
    document.getElementById('resultado').style.display='none';    
  }
}

function RellenarEscaneo(scan_content) {
  //para los dispositivos pequenos se puede mostrar y ocultar la camara y el resultado
  //cuando se haga el escaneo para ponerla al 100% y mejorar el escaneo
  if (enEntornoMovil) {
    document.getElementById('camara').style.display='none';
    document.getElementById('resultado').style.display='block';    
  }
  //sectionScan
  document.getElementById('wait').style.display='block';
  //var millisecondsToWait = 2000;
  //setTimeout(function() {
    var myNode = document.getElementById('scanUL');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    //document.getElementById('scanUL').children[0].style.display = 'none';
    var liElement = document.createElement('li');
    liElement.title = liElement.innerText = scan_content;
    liElement.className = 'scans-enter-active';
    document.getElementById('scanUL').appendChild(liElement);  
    document.getElementById('btnAcceso').style.display='block';
    document.getElementById('wait').style.display='none';
  //}, millisecondsToWait);
  
}

function PonerNoCamaras() {
  var liElement = document.createElement('li');
  liElement.className='empty';
  liElement.innerText='No cameras found'; 
  document.getElementById('ulCameras').appendChild(liElement);
  document.getElementById('preview').style.display='none';
  document.getElementById('nocamera').style.display='block';
}

var cameras = [];
function RellenarCamaras() {
  //ulCameras  
  if (cameras.length==0) {
    PonerNoCamaras();    
  }
  else {    
    cameras.forEach(function (item, index) {
      var liElement = document.createElement('li');
      var nombre = formatName(item.name);
      liElement.title = nombre;
      var spanElement = document.createElement('span');
      if (item.id == activeCameraId) {
        spanElement.className = 'active';
        spanElement.innerText = nombre;
      }
      else {
        var aElement = document.createElement('a');
        aElement.innerText = nombre;
        aElement.addEventListener("click", function (event) {
          selectCamera(item);
        });
        spanElement.appendChild(aElement);
      };
      liElement.appendChild(spanElement);
      document.getElementById('ulCameras').appendChild(liElement);
    });
  }  
}

function ModificarListaCamaras(){  
  var myNode = document.getElementById('ulCameras');
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  RellenarCamaras();
}

function formatName(name) {
      return name || '(unknown)';
    };

function selectCamera(camera) {        
      activeCameraId = camera.id;
      scanner.camera = camera;
      scanner.start();      
      document.getElementById('preview').style.display='block';
      document.getElementById('nocamera').style.display='none';
      ModificarListaCamaras();
    }

var handleMediaChange = function (mql) {

    // For some reason Firefox has trouble always running this code.
    // The console.log seems to help it.
    // TODO: Figure out what the hell that's all about
    //console.log();        
    //if (mql.matches) {}
    if (mql.matches && (mql.media==='screen and (max-width: 480px)' || mql.media==='screen and (max-width: 767px)')) {
        //movil            
        enEntornoMovil = true;
        if (document.getElementById('btnAcceso').style.display=='block') {
          document.getElementById('camara').style.display='none';
          document.getElementById('resultado').style.display='block';
        }
        else {
          document.getElementById('camara').style.display='block';
          document.getElementById('resultado').style.display='none';
        }        
    }        
    else {
      enEntornoMovil = false;
      document.getElementById('camara').style.display='block';
      document.getElementById('resultado').style.display='block';
    }
};

document.addEventListener("DOMContentLoaded", function (event) {

  try 
  {
    //https://bugs.chromium.org/p/chromium/issues/detail?id=49001
    //poner el chrome con --allow-file-access-from-files para probarlo en local
    mqEvents(handleMediaChange);

    scanner = new Instascan.Scanner({mirror: false, video: document.getElementById('preview'), scanPeriod: 5 });
    scanner.addListener('scan', function (content, image) {      
      RellenarEscaneo(content);
      //scans.unshift({ date: +(Date.now()), content: content });
    });
    Instascan.Camera.getCameras().then(function (camerasdt) {
      //si no sale el nombre es porque no es un https          
      if (camerasdt.length > 0) {
        cameras = camerasdt;
        activeCameraId = camerasdt[camerasdt.length-1].id;
        scanner.camera = camerasdt[camerasdt.length-1];
        scanner.start();        
      } else {
        console.error('No cameras found.');      
      };      
      RellenarCamaras();
    }).catch(function (e) {
      console.error(e);
      PonerNoCamaras();    
    });  
  }
  catch (err)
  {
    PonerNoCamaras();
  }

});