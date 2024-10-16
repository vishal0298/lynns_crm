export const toTitleCase = (str) => {
  if (typeof str !== 'string' || str.trim() === '') {
    return str;
  }

  return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
};

export const convertFirstLetterToCapital = (inputString) => {
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return ""; // Return an empty string if input is not valid or empty
  }

  const convertedString = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  return convertedString;
}

export const amountFormat = (value) => {
  return (value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const sortbyINVnumberDESC = (array) => {
  if(array?.length > 0){
    array.sort((a, b) => {
      if (a.invoiceNumber < b.invoiceNumber) {
          return 1;
      }
      if (a.invoiceNumber > b.invoiceNumber) {
          return -1;
      }
      return 0;
  });
  return array;
  }else{
    return [];
  }
}

export const handleKeyPress = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);
  if (/^\d+$/.test(keyValue)) {
    event.preventDefault();
  }
};

export function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const dataURLtoBlob = (dataURL) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};



