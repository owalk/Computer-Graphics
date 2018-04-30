var container;
var camera, scene, renderer;
var raycaster, mouse;
var mesh, line;
var controls;

init();
animate();
function init() {
    container = document.getElementById( 'container' );
    //
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 8500 );
    camera.position.z = 2700;
    camera.position.x = 0;
    camera.position.y = 800;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x7e9184 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 6500 );

    // everywhere light setup
    scene.add( new THREE.AmbientLight( 0x444444, 1.5 ) );

    // bottom platform setup
    var material_platform = new THREE.MeshLambertMaterial();
    var geometry_platform = new THREE.PlaneGeometry(2000, 2000, 100, 100);

    var mesh_platform = new THREE.Mesh(geometry_platform, material_platform);

    // flatten mesh
    mesh_platform.rotation.x = -90 * (Math.PI/180);

    // move mesh below object
    mesh_platform.position.y = -800;
    
    scene.add(mesh_platform);

    // put a bunch of triangles into a cube
    triangle_stuff();
    

    //overhead light setup
    var light = new THREE.SpotLight( 0xffffff, 5.0, 10000);
    light.position.y = 3500;
    light.target = mesh;
    

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );
    var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2, transparent: true } );
    line = new THREE.Line( geometry, material );
    scene.add( line );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( (window.innerWidth*3)/4, (window.innerHeight*3)/4);
    container.appendChild( renderer.domElement );

    // shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 100, 1, 500, 5000 ) );

    light.shadow.mapSize.width = 2048 * 2;
    light.shadow.mapSize.height = 2048 * 2;
    
    mesh.castShadow = true;
    mesh_platform.receiveShadow = true;

    //add light to scene with shadow casting on the two mesh objects
    scene.add( light );

    //
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
}
function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}
function render() {
    var time = Date.now() * 0.001;
    mesh.rotation.x = time * 0.15;
    mesh.rotation.y = time * 0.25;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObject( mesh );
    if ( intersects.length > 0 ) {
	var intersect = intersects[ 0 ];
	var face = intersect.face;
	var linePosition = line.geometry.attributes.position;
	var meshPosition = mesh.geometry.attributes.position;
	linePosition.copyAt( 0, meshPosition, face.a );
	linePosition.copyAt( 1, meshPosition, face.b );
	linePosition.copyAt( 2, meshPosition, face.c );
	linePosition.copyAt( 3, meshPosition, face.a );
	mesh.updateMatrix();
	line.geometry.applyMatrix( mesh.matrix );
	line.visible = true;
    } else {
	line.visible = false;
    }
    renderer.render( scene, camera );
}

function triangle_stuff(){
     // number if triangles
    var triangles =  5000;

    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array( triangles * 3 * 3 );
    var normals = new Float32Array( triangles * 3 * 3 );
    var colors = new Float32Array( triangles * 3 * 3 );
				var color = new THREE.Color();
    var n = 900, n2 = n/2;	// triangles spread in the cube
    var d = 120, d2 = d/2;	// individual triangle size
    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
    for ( var i = 0; i < positions.length; i += 9 ) {
	// positions
	var x = Math.random() * n - n2;
	var y = Math.random() * n - n2;
	var z = Math.random() * n - n2;
	var ax = x + Math.random() * d - d2;
	var ay = y + Math.random() * d - d2;
	var az = z + Math.random() * d - d2;
	var bx = x + Math.random() * d - d2;
	var by = y + Math.random() * d - d2;
	var bz = z + Math.random() * d - d2;
	var cx = x + Math.random() * d - d2;
	var cy = y + Math.random() * d - d2;
	var cz = z + Math.random() * d - d2;
	positions[ i ]	   = ax;
	positions[ i + 1 ] = ay;
	positions[ i + 2 ] = az;
	positions[ i + 3 ] = bx;
	positions[ i + 4 ] = by;
	positions[ i + 5 ] = bz;
	positions[ i + 6 ] = cx;
					positions[ i + 7 ] = cy;
	positions[ i + 8 ] = cz;
	// flat face normals
	pA.set( ax, ay, az );
	pB.set( bx, by, bz );
	pC.set( cx, cy, cz );
	cb.subVectors( pC, pB );
	ab.subVectors( pA, pB );
	cb.cross( ab );
	cb.normalize();
	var nx = cb.x;
	var ny = cb.y;
	var nz = cb.z;
	normals[ i ]	 = nx;
	normals[ i + 1 ] = ny;
	normals[ i + 2 ] = nz;
	normals[ i + 3 ] = nx;
	normals[ i + 4 ] = ny;
	normals[ i + 5 ] = nz;
	normals[ i + 6 ] = nx;
	normals[ i + 7 ] = ny;
	normals[ i + 8 ] = nz;
	// colors
	var vx = ( x / n ) + 0.5;
	var vy = ( y / n ) + 0.5;
	var vz = ( z / n ) + 0.5;
	color.setRGB( vx, vy, vz );
	colors[ i ]	= color.r;
	colors[ i + 1 ] = color.g;
	colors[ i + 2 ] = color.b;
	colors[ i + 3 ] = color.r;
	colors[ i + 4 ] = color.g;
	colors[ i + 5 ] = color.b;
	colors[ i + 6 ] = color.r;
	colors[ i + 7 ] = color.g;
	colors[ i + 8 ] = color.b;
    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    var material = new THREE.MeshPhongMaterial( {
	color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
	side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
}
