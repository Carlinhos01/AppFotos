import {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage, fire} from "../Firebase";
import { collection, onSnapshot } from 'firebase/firestore';

export default function Home(){
    const [img, setImg] = useState("");
    const [file, setFile] = useState("");

    useEffect(()=>{
        const unsubscribe = onSnapshot(collection(fire, "files"),(snaphot)=>{
            snaphot.docChanges().forEach((chage)=>{
                if(chage.type === "added"){
                    setFile((prevFiles) =>[...prevFiles, chage.doc.data()]);
                }
            })
        });
        return () => unsubscribe()
    }, []);
    
    async function uploadImage(uri, fileType){
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, "");
        const uploadTask = uploadBytesResumable(storageRef,blob);

        uploadTask.on(
            "state_changed",
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL)=>{
                    await saveRecord(fileType, downloadURL, new Date().toISOString());
                    setImg("");
                });
            }
        )
    }

    async function saveRecord(fileType, url, createdAt){
        try{
            const docRef = await addDoc(collection,(fire,"files"),{
                fileType,
                url,
                createdAt,
            })
        }catch(e){
            console.log(e);
        }
    }

    return(
        <View>
            <Text>Minhas Fotos</Text>
            <FlatList
                data={file}
                keyExtractor={(item)=>item.url}
                renderItem={(item)=>{
                    if(item.fileType ==="img"){
                        <Image
                            source={{uri:item}}
                            style={estilo.fotos}
                        />
                    }
                }
                }
            />
        </View>
    )
}

const estilo = StyleSheet.create({
    container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
    },
    fotos:{
        width:200,
        height:200
    }
});