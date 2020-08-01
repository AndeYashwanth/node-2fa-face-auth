const delayInMilli = 3000;
const delay = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, delayInMilli);
});

/**
 * @returns {JSON}
 */
export default (py, dbQueryService) => async (id, filename, email = undefined) => {
  py.stdin.write(`${JSON.stringify({ id, filename })}\n`);
  await delay();

  // If no response has arrived from the child process, globalobj wont have id key.

  if (typeof global.globalobj[id] === 'undefined') {
    const err = new Error('No response from child process');
    err.status = 500;
    throw err;
  }
  const obj = global.globalobj[id];
  delete global.globalobj[id];

  if (obj.success !== true) {
    const err = new Error(obj.message || 'Error message not received from spawned process');
    err.status = 500;
    throw err;
  }

  if (!email) { // this method is called during register and login. email is not passed when login. So return directly
    return obj.encoding;
  }

  const dist = await dbQueryService.getFaceEmbeddingDistance(email, obj.encoding);
  if (dist.length === 0) { // this should not execute as pwd authentication is already done without issues
    const err = new Error('No record found');
    err.status = 401;
    throw err;
  }
  if (dist[0].distance > 0.4) {
    const err = new Error("Face doesn't match");
    err.status = 401;
    throw err;
  }
  return dist[0].distance;
};
