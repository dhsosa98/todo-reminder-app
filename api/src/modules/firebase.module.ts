import { Module, Provider } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { FirebaseService } from "src/services/firebase.service";



export const firebaseProvider: Provider = {
    provide: 'FIREBASE_APP',
    useFactory: () => {
      return null;  
    },
  };
  



@Module({
    imports: [],
    providers: [firebaseProvider, FirebaseService],
    exports: [FirebaseService, firebaseProvider]
})
export class FirebaseModule {}