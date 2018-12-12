export var NetsolinApp = {
  urlNetsolinverilicen: 'http://190.85.93.218/SASNETSOLIN17/',
  iniNetsolin: false,
  oapp: {
    "nom_empresa": '',
    "nit_empresa": '',
    "cuserid": '',
    "cuserpsw": '',
    "motor":3,
    "prefijo_sqlbd": '',
    "nomusuar": '',
    "superusuar": '',
    "num_version": '',
    "en_prod": '',
    "obj_actual": 'CODOBJ',
  },
  objtitmodulo: {
    "titulo": "Titulo Modulo",
    "Menu": "menu"
  },
  objenvrest: {
    "usuario": "NETSOLIN",
    "psw": "psww",
    "prefijobd": "",
    "parametros":{},
    "en_prod": '',
    "prod":"",
    "tiporet":"",
    "filtro": "nombre like 'A%'"
  },
  objenvrestddtabla: {
    "usuario": "NETSOLIN",
    "psw": "psww",
    "prefijobd": "",
    "aplica": 0,
    "objeto": "",
    "en_prod": '',
    "exporta": "",
    "tabla": ""
  },
  objpartablabas: {
    "titulo": "",
    "subtitulo": "",
    "rutamant": "",
    "prefopermant": "",
    "objeto": "",
    "aplica": 0,
    "tabla": "",
    "campollave": "",
    "camponombre": "",
    "clase_nbs": "",
    "clase_val": "",
    "campos_lista":{},
    "orden": ""
  },

  objenvrestsolcomobog: {
    "usuario": "NETSOLIN",
    "psw": "psww",
    "prefijobd": "",
    "filtro": "nombre like 'A%'",
    "tabla": "CIUDADES",
    "orden": "1",
    "campos": "*",
    "cursor": "Tdatos",
    "campollave": "",
    "llave": "",
    "filtroadi":"",
    "en_prod": '',
    "objeto":"",
    "aplica": 0

  },
  objenvrestcrud: {
    "usuario": "NETSOLIN",
    "psw": "psww",
    "prefijobd": "",
    "filtro": "nombre like 'A%'",
    "tabla": "CIUDADES",
    "clase_nbs": "",
    "clase_val": "",
    "orden": "1",
    "campos": "*",
    "cursor": "Tdatos",
    "campollave": "",
    "llave": "",
    "aplica": 0,
    "objeto": "",
    "en_prod": '',
    "exporta": "",
    "delete": "N",
    "datos": {}
  },
  objseguridad: {
    "objeto": "",
    "per_adicionar": false,
    "per_consultar": false,
    "per_modificar": false,
    "per_eliminar": false
  },
  param_precioven: {
    "lista": "",
    "cod_refven": "100    ",
    "cod_tercer": "",
    "proc_ven": "016 ",
    "cantidad":10
  },
  copiaCrumbs: {
    "titulopag": '',
    "rutaanterior":  '',
    "titrutaanterior": '',
    "mostrarbreadcrumbs":  true
  }
};
