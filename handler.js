const users = require('./users/users');

global.ENV = process.env['ENV'];
global.isLocal = !!process.env['LOCAL'];

console.log('Local build', isLocal);

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

	if (!body.name){
    console.log('Name wasn\'t provided');
    return {
      statusCode: 400,
      body: 'Name wasn\'t provided',
    };
  }

  try {
		const userApiKey = await users.createUser({
			name: body.name
		});
		console.log('Added new user with name', body.name, 'and api key', userApiKey);
		
		return {
			statusCode: 200,
			body: JSON.stringify(
				{
					message: 'Success',
					api_key: userApiKey
				}
			),
		};
	} catch (e){
		console.log('Error occurred', e);
		
		return {
			statusCode: 500,
			body: 'Error Occurred'
		};
	}

};
