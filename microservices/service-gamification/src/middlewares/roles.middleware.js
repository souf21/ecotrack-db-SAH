module.exports = (...allowed) => (req, res, next) => {
  const roles = allowed.flat();
  if (!req.user)               return res.status(401).json({ error: 'Non authentifié' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: `Rôle requis : ${roles.join(' ou ')}` });
  next();
};
