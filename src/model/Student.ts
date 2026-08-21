export interface Student {
   id : number; 
   nom : String ; 
   prenom : String ; 
   score ?: number ;
   jourDInscritpion : Date ; 
   CIN: String ;
   
}
export interface CreateStudentDTO { 
   prenom: String ;
   nom: String ;
   score: number ; 
   CIN: String ;
}
export interface UpdateStudentDTO{ 
   prenom?: String ;
   score?: number ; 
   nom?: string ;
}


  
