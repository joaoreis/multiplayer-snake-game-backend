// noinspection SpellCheckingInspection

/**
 * @constant _users
 * @type {Array<User>}
 */
const _users = [];

/**
 * @function setNewUser adicionar novo usuário a lista de usuários
 * @param {User} newUser
 */
const setNewUser = (newUser) => {
  _users.push(newUser);
}

/**
 * @function removeUserById remove usuário pelo id
 * @param {string} userId
 */
const removeUserById = (userId) => {
  let i = 0;
  while (i < _users.length){
    if(_users[i].id === userId){
      console.log(`USERID: ${userId} - DELETED`)
      _users.splice(i, 1);
      return;
    }
    i++;
  }
}

const userExists = (userId) => {
  return !!_users.find(el => el.id === userId);
};

export {
  setNewUser,
  removeUserById,
  userExists
}
