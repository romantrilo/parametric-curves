/*
  This is a generic "ThreeJS Application"
  helper which sets up a renderer and camera
  controls.
 */

const createControls = require('orbit-controls');
const assign = require('object-assign');
const defined = require('defined');
const mouseEventOffset = require('mouse-event-offset');
const tweenr = require('tweenr')();
const isMobile = require('./util/isMobile');
const query = require('./util/query');

var tmpVal = {x:0, y:0, z:0};

var pubnub = PUBNUB.init({
  publish_key: 'pub-c-137188ab-17c8-4b00-bf97-3b4857d46dbc',
  subscribe_key: 'sub-c-e49af17e-f0c3-11e6-8e1d-02ee2ddab7fe'
});

var channel = 'mov';

var val = {x:0, y:0, z:0};

pubnub.subscribe({
  channel: channel,
  message: function(m) {
    val = m.devState; // the raw data
    // console.log(val);
  }
});

module.exports = createApp;
function createApp (opt = {}) {
  // Scale for retina
  const dpr = defined(query.dpr, Math.min(2, window.devicePixelRatio));

  const cameraDistance = isMobile ? 2 : 1.75;
  const theta = 0 * Math.PI / 180;
  //const angleOffset = 180;
  const devOffset = new THREE.Vector3();
  const tmpQuat1 = new THREE.Quaternion();
  const tmpQuat2 = new THREE.Quaternion();
  const tmpQuat3 = new THREE.Quaternion();
  const AXIS_X = new THREE.Vector3(1, 0, 0);
  const AXIS_Y = new THREE.Vector3(0, 1, 0);
  const AXIS_Z = new THREE.Vector3(0, 0, 1);

  // Our WebGL renderer with alpha and device-scaled
  const renderer = new THREE.WebGLRenderer(assign({
    alpha: false,
    stencil: false,
    antialias: true // default enabled
  }, opt));
  renderer.setPixelRatio(dpr);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.gammaInput = true;
  renderer.sortObjects = false;

  // Add the <canvas> to DOM body
  const canvas = renderer.domElement;

  // perspective camera
  const near = 0.1;
  const far = 10;
  const fieldOfView = 65;
  const camera = new THREE.PerspectiveCamera(fieldOfView, 1, near, far);
  const target = new THREE.Vector3();

  // 3D scene
  const scene = new THREE.Scene();

  // slick 3D orbit controller with damping
  const useOrbitControls = query.orbitControls;
  let controls;
  if (useOrbitControls) {
    controls = createControls(assign({
      canvas,
      theta,
      distanceBounds: [ 0.5, 5 ],
      distance: cameraDistance
    }, opt));
  }

  // Update renderer size
  window.addEventListener('resize', resize);

  const app = assign({}, {
    tick,
    camera,
    scene,
    renderer,
    canvas,
    render
  });

  app.width = 0;
  app.height = 0;
  app.top = 0;
  app.left = 0;

  // Setup initial size & aspect ratio
  resize();
  tick();
  //createMouseParallax();
  //createDeviceParallax();
  return app;

  function createDeviceParallax () {

      //console.log(val);

      // tweenr.cancel().to(devOffset, {
      //   x: (val.x / 9.81 * Math.PI),
      //   y: (val.y / 9.81 * Math.PI),
      //   ease: 'expoOut',
      //   duration: 0.5
      // });
  }

  function tick (dt = 0) {
    const aspect = app.width / app.height;
    if (useOrbitControls) {
      // update camera controls
      controls.update();
      camera.position.fromArray(controls.position);
      camera.up.fromArray(controls.up);
      target.fromArray(controls.direction).add(camera.position);
      camera.lookAt(target);
    } else {
      const phi = Math.PI / 2;
      camera.position.x = Math.sin(phi) * Math.sin(theta);
      camera.position.y = Math.cos(phi);
      camera.position.z = Math.sin(phi) * Math.cos(theta);

      const radius = cameraDistance;
      //const radianOffset = angleOffset * Math.PI / 180;

      const tmp = [0, 0, 0];


///-----------var.1-----------------------------------------------

// val.x = val.x * Math.PI / 180;

// var dist = Math.abs( val.x - tmpVal.x );

      // if ( dist > Math.PI ) {
      //   if ( val.x < Math.PI && tmpVal.x % (2 * Math.PI) > Math.PI ) {
      //     tmp[0] =  tmpVal.x + dist;
      //     tmpVal.x = tmp[0];
      //   } else if ( val.x > 180 && tmpVal.x % (2 * Math.PI) < Math.PI ) {
      //     tmp[0] = tmpVal.x - dist;
      //     tmpVal.x = tmp[0];
      //   }
      // } else {
      //   if ( val.x > tmpVal.x ) {
      //     tmp[0] = tmpVal.x + dist;
      //     tmpVal.x = tmp[0];
      //   } else {
      //     tmp[0] = tmpVal.x - dist;
      //     tmpVal.x = tmp[0];
      //   }
      //
      // }

///-----------var.2-----------------------------------------------

      tmp[0] = val.x  *  Math.PI / 180;
      // tmp[1] = (val.y + 180)  *  Math.PI / 180;
      // tmp[2] = (val.z + 90)  *  Math.PI / 180;



      // var dist = Math.abs(devOffset.x - tmp[0]);
      //
      // if ( dist > Math.PI ) {
      //   if ( tmp[0] < Math.PI && devOffset.x > Math.PI ) {
      //     tmp[0] += 2 * Math.PI;
      //   } else if ( tmp[0] > Math.PI && devOffset.x < Math.PI ) {
      //     tmp[0] -= 2 * Math.PI;
      //   }
      // }

///-----------var.3-----------------------------------------------
      tmp[0] = val.x  *  Math.PI / 180;
      tmp[1] = ( val.y + 180 )  *  Math.PI / 180;
      tmp[2] = ( val.z + 90 )  *  Math.PI / 180;

      devOffset.x = correctCurrentRotation( tmp[0], devOffset.x );
      devOffset.y = correctCurrentRotation( tmp[1], devOffset.y );
      devOffset.z = correctCurrentRotation( tmp[2], devOffset.z );

      tweenr.cancel().to(devOffset, {
        x: tmp[0],
        y: tmp[1],
        z: tmp[2],
        ease: 'expoOut',
        duration: 0.5
      });

      //console.log(devOffset);
      console.log(tmp);

      const xOff = devOffset.z;// * radianOffset;
      const yOff = devOffset.x;// * radianOffset;
      const zOff = devOffset.y;// * radianOffset;

      tmpQuat1.setFromAxisAngle(AXIS_X, -xOff);
      tmpQuat2.setFromAxisAngle(AXIS_Y, yOff);
      tmpQuat3.setFromAxisAngle(AXIS_Z, -zOff);
      tmpQuat1.multiply(tmpQuat2);

      camera.position.applyQuaternion(tmpQuat1);
      camera.position.multiplyScalar(radius);

      target.set(0, 0, 0);
      camera.lookAt(target);
    }

    // Update camera matrices
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function render () {
    renderer.render(scene, camera);
  }

  function resize () {
    let width = defined(query.width, window.innerWidth);
    let height = defined(query.height, window.innerHeight);

    app.width = width;
    app.height = height;
    renderer.setSize(width, height);
    tick(0);
    render();
  }

  /**
   * Correct current rotation value to achiev shortest rotating
   * for example: from 10degs to 350degs, it will make like from 370degs to 350degs
   *
   * @param {number} targetRotation Value in radians
   * @param {number} currentRotation Value in radians
   */
  function correctCurrentRotation( targetRotation, currentRotation ) {
    var distance = Math.abs( currentRotation - targetRotation );

    if (distance > Math.PI) {
      if ( currentRotation < Math.PI && targetRotation > Math.PI ) {
        currentRotation += Math.PI * 2;
      } else if ( currentRotation > Math.PI && targetRotation < Math.PI ) {
        currentRotation -= Math.PI * 2;
      }
    }

    return currentRotation;
  }
}
