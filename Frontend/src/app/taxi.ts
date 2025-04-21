
export interface Taxi {
  id: number;
  matricula: string;//alfanumerico com restriçoes
  marca: string;//a partir de lista predefinida
  modelo: string;//a partir de lista predefinida
  ano_de_compra: `${number}`;//ano tipo ano? ou numero
  nivel_de_conforto: 'basico' | 'luxuoso'; 
}

