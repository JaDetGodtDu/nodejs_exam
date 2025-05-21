import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-bottom-center",
  timeOut: 1500,
  extendedTimeOut: 1000,
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export const showSuccess = (message) => toastr.success(message);
export const showError = (message) => toastr.error(message);
export const showInfo = (message) => toastr.info(message);
export const showWarning = (message) => toastr.warning(message);