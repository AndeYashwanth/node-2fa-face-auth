import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

const py = spawn('python', ['python/getFaceEncoding.py']);
global.globalobj = {};

// whenever any data arrives, it will be stored in globalobj.
py.stdout.on('data', (data) => {
  try {
    const { id, message, encoding, success } = JSON.parse(data.toString());
    global.globalobj[id] = { message, encoding, success };
  } catch (err) {
    // If data chunk received is incomplete(child process sent large output) json parse fails.
  }
});
export default py;
