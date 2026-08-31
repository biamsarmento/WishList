// Presentes antigos guardam caminho relativo ("./images/x.png"); presentes
// cadastrados pelo admin guardam URL absoluta do Supabase Storage. Normaliza
// os dois pra funcionar em qualquer página, independente da rota atual.
export function resolveImageSrc(image) {
  return image.startsWith("./") ? image.slice(1) : image;
}
