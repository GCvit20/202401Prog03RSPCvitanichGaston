class Persona 
{
    constructor(id, nombre, apellido, fechaNacimiento) 
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString() 
    {
        return `Nombre: ${this.nombre}, Apellido: ${this.apellido}, Edad: ${this.edad}`;
    }
}

class Heroe extends Persona 
{
    constructor(id, nombre, apellido, edad, alterEgo, ciudad, publicado) 
    {
        super(id, nombre, apellido, edad);
        this.alterEgo = alterEgo;
        this.ciudad = ciudad;
        this.publicado = publicado;
    }

    toString() 
    {
        return `${super.toString()}, AlterEgo: ${this.alterEgo}, Ciudad: ${this.ciudadalterEgo}, Publicado: ${this.publicado}`;
    }
}

class Villano extends Persona 
{
    constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) 
    {
        super(id, nombre, apellido, edad);
        this.enemigo = enemigo;
        this.robos = robos;
        this.asesinatos = asesinatos;
    }

    toString() 
    {
        return `${super.toString()}, Enemigo: ${this.enemigo}, Robos: ${this.robos}, Asesinatos: ${this.asesinatos}`;
    }
}

let datosActuales = [];

function obtenerDatos() 
{
    const http = new XMLHttpRequest();
    http.open('GET', 'https://examenesutn.vercel.app/api/PersonasHeroesVillanos', true);

    http.onload = function() 
    {
        ocultarSpinner();

        if (http.readyState == 4 && http.status === 200) 
        {
            const datos = JSON.parse(http.responseText);
            datosActuales = datos;
            cargarLista(datosActuales);
        } 
        else 
        {
            alert('No se pudieron obtener los datos');
        }
    };

    http.onerror = function() 
    {
        ocultarSpinner();
        alert('Error al intentar obtener los datos');
    };

    http.send();
}

function cargarLista(datos) 
{
    const tabla = document.getElementById('tablaDatos');
    tabla.innerHTML = '';

    datos.forEach(item => 
    {
        console.log('Procesando item:', item);
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.id || 'N/A'}</td>
            <td>${item.nombre || 'N/A'}</td>
            <td>${item.apellido || 'N/A'}</td>
            <td>${item.edad || 'N/A'}</td>
            <td>${item.alterEgo || 'N/A'}</td>
            <td>${item.ciudad || 'N/A'}</td>
            <td>${item.publicado || 'N/A'}</td>
            <td>${item.enemigo || 'N/A'}</td>
            <td>${item.robos || 'N/A'}</td>
            <td>${item.asesinatos || 'N/A'}</td>
            <td><button id="btn_modificar-${item.id}">Modificar</button></td>
            <td><button id="btn_eliminar-${item.id}">Eliminar</button></td>
        `;
        tabla.appendChild(fila);

        document.getElementById(`btn_modificar-${item.id}`).addEventListener('click', () => modificarElemento(item.id));
        document.getElementById(`btn_eliminar-${item.id}`).addEventListener('click', () => mostrarEliminar(item.id));
        
    });
}

function mostrarSpinner() 
{
    document.getElementById('spinner-container').style.display = 'flex';
}

function ocultarSpinner() 
{
    document.getElementById('spinner-container').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() 
{
    document.getElementById('btn_registrar').addEventListener('click', mostrarFormularioAlta);
    document.getElementById('btn_agregar').addEventListener('click', aceptarAlta);
    document.getElementById('btn_cancelar').addEventListener('click', ocultarFormulario);
    document.getElementById('btn_modificar').addEventListener('click', aceptarModificacion);
    document.getElementById('btn_eliminar').addEventListener('click', aceptarEliminar);
    document.getElementById("tipo").addEventListener("change", filtrar_datos);

    mostrarSpinner();
    obtenerDatos();
});

function mostrarFormularioAlta() 
{
    document.getElementById('formTitulo').innerText = 'Agregar Elemento';
    document.getElementById('FormDatos').style.display = 'none';
    document.getElementById('formulario').style.display = 'block';


    document.getElementById('alterEgo').disabled = true;
    document.getElementById('ciudad').disabled = true;
    document.getElementById('publicado').disabled = true;
    document.getElementById('enemigo').disabled = true;
    document.getElementById('robos').disabled = true;
    document.getElementById('asesinatos').disabled = true;
    document.getElementById("id").disabled = true;
    document.getElementById('btn_modificar').disabled = true;
    document.getElementById('btn_eliminar').disabled = true;
    document.getElementById('btn_agregar').disabled = false;
    document.getElementById('tipo').disabled = false;

}

function filtrar_datos() 
{
    const opcion = document.getElementById("tipo").value;

    switch (opcion) 
    {
        case "heroe":
            document.getElementById('enemigo').disabled = true;
            document.getElementById('robos').disabled = true;
            document.getElementById('asesinatos').disabled = true;
            document.getElementById('alterEgo').disabled = false;
            document.getElementById('ciudad').disabled = false;
            document.getElementById('publicado').disabled = false;
        break;
        case "villano":
            document.getElementById('enemigo').disabled = false;
            document.getElementById('robos').disabled = false;
            document.getElementById('asesinatos').disabled = false;
            document.getElementById('alterEgo').disabled = true;
            document.getElementById('ciudad').disabled = true;
            document.getElementById('publicado').disabled = true;
        break;
        default:
            document.getElementById('enemigo').disabled = true;
            document.getElementById('robos').disabled = true;
            document.getElementById('asesinatos').disabled = true;
            document.getElementById('alterEgo').disabled = true;
            document.getElementById('ciudad').disabled = true;
            document.getElementById('publicado').disabled = true;
        break;
    }
}

function ocultarFormulario() 
{
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('FormDatos').style.display = 'block';
    limpiarFormulario();
}

function validarDatos(nuevoElemento) 
{
    if (!nuevoElemento.nombre || !nuevoElemento.apellido) {
        alert("Nombre y Apellido son campos obligatorios.");
        return false;
    }
    if (!nuevoElemento.edad) {
        alert("La edad no puede ser nula.");
        return false;
    }
    if (document.getElementById("tipo").value === "heroe") {
        if (!nuevoElemento.alterEgo || !nuevoElemento.ciudad || nuevoElemento.publicado === null) {
            alert("El héroe debe tener alterEgo, ciudad y año de publicación.");
            return false;
        }
        if (nuevoElemento.publicado <= 1940) {
            alert("El año de publicación debe ser mayor a 1940.");
            return false;
        }
    }
    if (document.getElementById("tipo").value === "villano") {
        if (!nuevoElemento.enemigo || nuevoElemento.robos === null || nuevoElemento.asesinatos === null) {
            alert("El villano debe tener enemigo, robos y asesinatos.");
            return false;
        }
        if (nuevoElemento.robos <= 0) {
            alert("El número de robos debe ser mayor a 0.");
            return false;
        }
        if (nuevoElemento.asesinatos <= 0) {
            alert("El número de asesinatos debe ser mayor a 0.");
            return false;
        }
    }
    return true;
}

function aceptarAlta() 
{
    const nuevoElemento = 
    {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        edad: document.getElementById('edad').value,
        alterEgo: document.getElementById('alterEgo').parentElement.style.display !== 'none' ? document.getElementById('alterEgo').value : null,
        ciudad: document.getElementById('ciudad').parentElement.style.display !== 'none' ? document.getElementById('ciudad').value : null,
        publicado: document.getElementById('publicado').parentElement.style.display !== 'none' ? document.getElementById('publicado').value : null,
        enemigo: document.getElementById('enemigo').parentElement.style.display !== 'none' ? document.getElementById('enemigo').value : null,
        robos: document.getElementById('robos').parentElement.style.display !== 'none' ? document.getElementById('robos').value : null,
        asesinatos: document.getElementById('asesinatos').parentElement.style.display !== 'none' ? document.getElementById('asesinatos').value : null
    };

    if (!validarDatos(nuevoElemento)) 
    {
        return;
    }

    mostrarSpinner();

    fetch('https://examenesutn.vercel.app/api/PersonasHeroesVillanos', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoElemento)
    })
    .then(response => 
    {
        ocultarSpinner();

        if (response.ok) 
        {
            return response.json();
        } 
        else 
        {
            throw new Error('No se pudo agregar el elemento');
        }
    })
    .then(data => 
    {
        console.log("Respuesta del servidor:", data);
        
        nuevoElemento.id = data.id;

        datosActuales.push(nuevoElemento);
        cargarLista(datosActuales); 
        alert('Elemento agregado exitosamente');
        limpiarFormulario();
        ocultarFormulario(); 
    })
    .catch(error => 
    {
        ocultarSpinner();
        alert('Error de red al intentar agregar el elemento');
        console.error('Error:', error);
    });
}

function limpiarFormulario() 
{
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('alterEgo').value = '';
    document.getElementById('ciudad').value = '';
    document.getElementById('publicado').value = '';
    document.getElementById('enemigo').value = '';
    document.getElementById('robos').value = '';
    document.getElementById('asesinatos').value = '';
    document.getElementById('tipo').value = ''; 

    document.getElementById('alterEgo').disabled = true;
    document.getElementById('ciudad').disabled = true;
    document.getElementById('publicado').disabled = true;
    document.getElementById('enemigo').disabled = true;
    document.getElementById('robos').disabled = true;
    document.getElementById('asesinatos').disabled = true;
}

async function modificarElemento(id) 
{
    // Buscar el elemento por ID en la lista de datos actuales
    const elemento = datosActuales.find(item => item.id === id);

    if (!elemento) 
    {
        alert("Elemento no encontrado");
        return;
    }

    document.getElementById('nombre').value = elemento.nombre;
    document.getElementById('apellido').value = elemento.apellido;
    document.getElementById('edad').value = elemento.edad;
    alterEgo = document.getElementById('alterEgo').value = elemento.alterEgo || '';
    ciudad = document.getElementById('ciudad').value = elemento.ciudad || '';
    publicado = document.getElementById('publicado').value = elemento.publicado || '';
    document.getElementById('enemigo').value = elemento.enemigo || '';
    document.getElementById('robos').value = elemento.robos || '';
    document.getElementById('asesinatos').value = elemento.asesinatos || '';

    document.getElementById('tipo').disabled = true;
    document.getElementById('id').value = id;
    document.getElementById('id').disabled = true;
    document.getElementById('btn_agregar').disabled = true;
    document.getElementById('btn_eliminar').disabled = true;
    document.getElementById('btn_modificar').disabled = false; 

    if(alterEgo !== '' && ciudad !== '' && publicado !== '')
    {
        document.getElementById('tipo').value = 'heroe';
    }
    else
    {
        document.getElementById('tipo').value = 'villano';

    }
        
    document.getElementById('formTitulo').innerText = 'Modificar Elemento';
    document.getElementById('FormDatos').style.display = 'none';
    document.getElementById('formulario').style.display = 'block';

    filtrar_datos();
}

async function aceptarModificacion() 
{
    const id = parseInt(document.getElementById('id').value, 10);

    const elementoModificado = 
    {
        id: id,
        nombre: document.getElementById('nombre').value || null,
        apellido: document.getElementById('apellido').value || null,
        edad: document.getElementById('edad').value || null,
        alterEgo: document.getElementById('alterEgo').parentElement.style.display !== 'none' ? document.getElementById('alterEgo').value : null,
        ciudad: document.getElementById('ciudad').parentElement.style.display !== 'none' ? document.getElementById('ciudad').value : null,
        publicado: document.getElementById('publicado').parentElement.style.display !== 'none' ? parseInt(document.getElementById('publicado').value) : null,
        enemigo: document.getElementById('enemigo').parentElement.style.display !== 'none' ? document.getElementById('enemigo').value : null,
        robos: document.getElementById('robos').parentElement.style.display !== 'none' ? parseInt(document.getElementById('robos').value) : null,
        asesinatos: document.getElementById('asesinatos').parentElement.style.display !== 'none' ? parseInt(document.getElementById('asesinatos').value) : null
    };

    console.log("Datos del elemento modificado:", elementoModificado);

    if (!validarDatos(elementoModificado)) 
    {
        return;
    }

    mostrarSpinner(); 

    try 
    {
        const response = await fetch('https://examenesutn.vercel.app/api/PersonasHeroesVillanos', 
        {
            method: 'PUT',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elementoModificado)
        });

        ocultarSpinner();

        if (response.ok) 
        {
            // Actualizar el elemento en la lista de datos actuales
            const index = datosActuales.findIndex(item => item.id === id);
            console.log("Índice del elemento modificado:", index);

            if (index !== -1) 
            {
                datosActuales[index] = elementoModificado;
                cargarLista(datosActuales);
                alert('Elemento modificado exitosamente');
            }

            limpiarFormulario();
            ocultarFormulario();
        } 
        else 
        {
            alert('No se pudo modificar el elemento.');
        }
    } 
    catch (error) 
    {
        ocultarSpinner();
        console.log("Error de red:", error);
        alert('Error de red al intentar modificar el elemento');
    }
}

function mostrarEliminar(id) 
{
    const elemento = datosActuales.find(item => item.id === id);

    if (!elemento) 
    {
        alert("Elemento no encontrado");
        return;
    }

    document.getElementById('nombre').value = elemento.nombre;
    document.getElementById('apellido').value = elemento.apellido;
    document.getElementById('edad').value = elemento.edad;
    alterEgo = document.getElementById('alterEgo').value = elemento.alterEgo || '';
    ciudad = document.getElementById('ciudad').value = elemento.ciudad || '';
    publicado = document.getElementById('publicado').value = elemento.publicado || '';
    document.getElementById('enemigo').value = elemento.enemigo || '';
    document.getElementById('robos').value = elemento.robos || '';
    document.getElementById('asesinatos').value = elemento.asesinatos || '';

    document.getElementById('tipo').disabled = true;
    document.getElementById('id').value = id;
    document.getElementById('id').disabled = true;
    document.getElementById('btn_agregar').disabled = true; 
    document.getElementById('btn_eliminar').disabled = false;
    document.getElementById('btn_modificar').disabled = true;

    if (alterEgo !== '' && ciudad !== '' && publicado !== '') 
    {
        document.getElementById('tipo').value = 'heroe';
    } 
    else 
    {
        document.getElementById('tipo').value = 'villano';
    }

    document.getElementById('formTitulo').innerText = 'Eliminar Elemento';
    document.getElementById('FormDatos').style.display = 'none';
    document.getElementById('formulario').style.display = 'block';

    filtrar_datos();
}

async function aceptarEliminar() 
{
    const id = parseInt(document.getElementById('id').value, 10);

    mostrarSpinner();

    try {
        const response = await fetch('https://examenesutn.vercel.app/api/PersonasHeroesVillanos', 
        {
            method: 'DELETE',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        });

        ocultarSpinner();

        if (response.ok) 
        {
            // Eliminar el elemento de la lista de datos actuales
            datosActuales = datosActuales.filter(item => item.id !== id);
            cargarLista(datosActuales); // Recargar la tabla con el nuevo conjunto de datos
            alert('Elemento eliminado exitosamente');

            limpiarFormulario();
            ocultarFormulario();
        } 
        else 
        {
            alert('No se pudo eliminar el elemento');
        }
    } 
    catch (error) 
    {
        ocultarSpinner();
        console.error("Error de red:", error);
        alert('Error de red al intentar eliminar el elemento');
    }
}

