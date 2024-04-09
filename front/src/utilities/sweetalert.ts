import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

export const deleteAlert = async (title: string, textAfter: string, text?: string) =>{
    return await Swal.fire({
    title: title || 'Are you sure?',
    text: text || "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'red',
    cancelButtonColor: '##c3c2c0;',
    confirmButtonText: 'Yes, delete it!'
}).then((result: any) => {
    if (!result.value) {
        throw new Error('Cancelled');
    }
    toast.success(textAfter, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
})}

export const successAlert = async (title: string, text?: string) =>{
    return toast.success(title + ' ' + (text || ''), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export const infoAlert = async (title: string, text?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500,
    })
}

export const errorAlert = async (title: string, text?: string) =>{
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        showCancelButton: false,
        showConfirmButton: false,
    })
}


