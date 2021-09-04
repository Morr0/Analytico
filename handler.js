const users = require('./users/users');

module.exports.createUser = async (event) => {
  let body = {};
  try {
    body = JSON.parse(event.body);
  } catch (e){
    console.log(e);
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }
  if (!body.name){
    console.log('Name wasn\'t provided');
    return {
      statusCode: 400,
      body: 'Name wasn\'t provided',
    };
  }

  const {
    SECRET
  } = process.env;
  if (body.secret !== SECRET){
    console.log('Unauthorized');
    return {
      statusCode: 403,
      body: 'Unauthorized'
    };
  }

  const userApiKey = await users.createUser({
    name: body.name
  }); 

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Success',
        api_key: userApiKey
      }
    ),
  };
};
