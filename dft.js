function dft (x) {
  let fourier = [];
  const N = x.length;

  for (let k = 0; k < N; k++) {

    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {

      let arg = (TWO_PI * k * n) / N;

      re += x[n] * cos(arg);
      im -= x[n] * sin(arg);
    }

    re /= N;
    im /= N;

    let freq = k;
    let amp = sqrt(re*re + im*im);
    let phase = atan2(im, re);

    fourier[k] = {re, im, freq, amp, phase}; 
    
  } 
  return fourier ;
}