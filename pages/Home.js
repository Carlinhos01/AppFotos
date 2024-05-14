import {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet,ScrollView} from 'react-native';
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage, fire} from "../Firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";

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

    async function pickImage(){
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
    
        if (!result.canceled) {
          setImg(result.assets.uri);
          await uploadImage(result.assets.uri, "image")
        }
      };

    return(
        
        <View style={estilo.container}>
            <Text style={estilo.titulo}>Minhas Fotos</Text>
            <FlatList
                data={file}
                keyExtractor={(item)=>item.url}
                renderItem={(item)=>{
                    if(item.fileType ==="img"){
                        <Image
                            source={{uri:item}.url}
                            style={estilo.fotos}
                        />
                    }
                }
                }
                numColumns={2}
            />

                <TouchableOpacity 
                    onPress={pickImage}
                    style={estilo.imgpick}>
                <Text style={estilo.subtitulo}>Images</Text>
                </TouchableOpacity>
      
        </View>
        
    )
    
}

const estilo = StyleSheet.create({
    container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    
    },
    fotos:{
        width:200,
        height:200
    },
    titulo:{
        fontSize: 35,
        marginTop:100,
    },
    imgpick:{
        position:"absolute",
        justifyContent: 'center',
        alignItems:'center',
        textAlign:'center',
        borderRadius:20,
        backgroundColor: '#4e56a1',
        width:150,
        height:100,
    },
    subtitulo:{
        fontSize:30,
    }
    
});