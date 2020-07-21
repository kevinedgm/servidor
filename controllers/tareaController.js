const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Extraer el proyecto y comprobar de que existe
    const { proyecto } = req.body;

    //Revisar el ID
    await Proyecto.findById(proyecto, (err, proyectoBusqueda) => {
      //Si el proyecto existe o no
      if (err || !proyectoBusqueda) {
        return res.status(404).json({ msg: "Proyecto no encontrado" });
      }

      //Verificar el creador del proyecto
      if (proyectoBusqueda.creador.toString() !== req.usuario.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }
    });

    //Creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtene tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar de que existe
    const { proyecto } = req.query;

    //Revisar el ID
    await Proyecto.findById(proyecto, (err, proyectoBusqueda) => {
      //Si el proyecto existe o no
      if (err || !proyectoBusqueda) {
        return res.status(404).json({ msg: "Proyecto no encontrado" });
      }

      //Verificar el creador del proyecto
      if (proyectoBusqueda.creador.toString() !== req.usuario.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }
    });

    //Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar Tarea
exports.actualizarTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { nombre, estado } = req.body;

    //Revisar el ID
    tareaBusqueda = await Tarea.findById(req.params.id);
    //Si el proyecto existe o no
    if (!tareaBusqueda) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    //Revisar si el proyecto es creado por el cliente
    await Proyecto.findById(tareaBusqueda.proyecto, (err, proyectoBusqueda) => {
      //Verificar el creador del proyecto

      if (proyectoBusqueda.creador.toString() !== req.usuario.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }
    });

    //Crear un objecto con la nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre != null ? nombre : tarea.nombre;
    nuevaTarea.estado = estado != null ? estado : tarea.estado;

    //Guadar tarea
    tareaBusqueda = await Tarea.findOneAndUpdate(
      { _id: req.params.id },
      nuevaTarea,
      { new: true }
    );

    res.json({ tareaBusqueda });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminar tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //Extrer el proyecto y comprobar si existe
    const { proyecto } = req.query;

    //si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);

    //extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminnar
    await Tarea.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
