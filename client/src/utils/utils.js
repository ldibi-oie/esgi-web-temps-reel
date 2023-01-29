import {Notyf} from "notyf"
import 'notyf/notyf.min.css'; 
var notyf = new Notyf({
    duration: 3000,
    position: {
      x: 'center',
      y: 'bottom',
    }
});

export const getUser = localStorage.getItem('user')
export const removeItem = localStorage.removeItem('user')
export const popUpError  = (message) => notyf.error(message);
export const popUpSuccess  = (message) => notyf.success(message);