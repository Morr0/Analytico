const users = require('./users/users');
const projects = require('./projects/projects');

global.ENV = process.env['ENV'];
global.isLocal = !!process.env['LOCAL'];

console.log('Local build', isLocal);

module.exports.createUser = async (event) => {
  let body = {};
  try {
    body = JSON.parse(event.body || {});
  } catch (e){
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

module.exports.createWebsiteAnalyticsProject = async (event) => {
	let body = {};
  try {
    body = JSON.parse(event.body || {});
  } catch (e){
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }

	const {
		api_key,
		project_name,
		website
	} = body;
	if (!api_key || !project_name || !website){
		return {
			statusCode: 400,
			body: 'Please provide api_key, project_name and website'
		};
	}

	try {
		const {
			projectId,
			projectSecret
		} = await projects.createProject({
			apiKey: api_key,
			projectName: project_name,
			website
		});

		console.log('Successfully created project for api key', api_key);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Success',
				project_id: projectId,
				project_secret: projectSecret
			}),
		};
	} catch (e){
		console.log('Error occurred', e);

		return {
			statusCode: 403,
			body: 'Unauthorized'
		};
	}
};

module.exports.listWebsiteAnalyticsProjects = async (event) => {
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

	if (!body.api_key){
		return {
			statusCode: 400,
			body: 'Please provide api_key'
		};
	}

	const projects = await projects.listProjects(apiKey);
	console.log('Got projects for api key', api_key, 'projects', projects);

	return {
		statusCode: 200,
		body: JSON.stringify(projects.map(({projectName, projectId, createdAt}) => ({
			project_name: projectName,
			project_id: projectId,
			created_at: createdAt
		})))
	};
};
