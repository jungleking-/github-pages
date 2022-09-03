   let url = "https://jungleking-.github.io/github-pages/Assets/3D/GLTF/Cloth0/scene.gltf";
   
   import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
   import Stats from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/libs/stats.module.js';    
   import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
   import { FBXLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/FBXLoader.js';
   import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
   
   let camera, scene, renderer, stats;
   
   const clock = new THREE.Clock();
   
   let mixer;

   var size = {
    width : 975,
    height : 1200
   }

   function innerWidth() {
     const div = document.getElementById('mainImageSlider');
     console.log(div.clientWidth);
     return div.clientWidth;
     return window.innerWidth;
   }

   function innerHeight() {
    const div = document.getElementById('mainImageSlider');
    return div.clientWidth;
    return window.innerHeight;
   }

   init();
   animate();
   
   function init() {      
    const div = document.getElementById('mainImageSlider');
    const container = document.createElement('li');
    container.className = "slider_main";
    div.appendChild(container);
//    document.body.appendChild(container);
    
    camera = new THREE.PerspectiveCamera(45, innerWidth() / innerHeight(), 1, 2000);
    camera.position.set(0, 150, 200);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);
    
    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));      
    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false}));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);
    
    // model

    const loader = new GLTFLoader();
    loader.load(url, function (gltf) {      
      mixer = new THREE.AnimationMixer(gltf);
      var model = gltf.scene;
      // console.log(object.animations);
      // const action = mixer.clipAction(object.animations[ 0 ]);
      // action.play();
      model.traverse(function (child) {        
        if (child.isMesh) {          
          child.castShadow = true;
          child.receiveShadow = true;          
        }        
      });
      scene.add(model);        
    });
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth(), innerHeight());
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();
    
    window.addEventListener('resize', onWindowResize, false);
    
    // stats
    // stats = new Stats();
    // container.appendChild(stats.dom);      
  }
  
  function onWindowResize() {      
    camera.aspect = innerWidth() / innerHeight();
    camera.updateProjectionMatrix();      
    renderer.setSize(innerWidth(), innerHeight());      
  }    
  
  function animate() {      
    requestAnimationFrame(animate);      
    const delta = clock.getDelta();      
    if (mixer) {
      mixer.update(delta);
    }      
    renderer.render(scene, camera);      
    // stats.update();      
  }    
  