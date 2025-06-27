export interface FileModel {
  extension : string;
  nom_original : string;
  nom_stockage : string;
  taille?:number;
}

export interface MetaData {
  extension : string;
  filename : string;
  path : string;
  taille : number;

}
