import Module from '../models/Auth/Module.js';

const instanceModule = new Module();

const checkPermissions = async (req, res) => {
  const { id_user } = req;
  const { urlToCheck } = req.body;

  try {
    const results = await instanceModule.canViewModule(id_user, urlToCheck);
    if (results.length > 0) {
      res.status(200).json({ message: 'El usuario tiene permisos para ver este módulo' });
    } else {
      res.status(403).json({ message: 'El usuario no tiene permisos para ver este módulo' });
    }
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    res.status(500).json({ message: 'Error al verificar permisos del usuario' });
  }
};

export default checkPermissions;
