import { StyleSheet, Text, View,Image, TouchableOpacity, ScrollView } from 'react-native'
import React,{useContext} from 'react'
import { NotificationContext } from '../context/NotificationContext';
import { CourseContext } from '../context/CourseContext';





 
const DA = ({navigation}) => {
    
  const { addNotification } = useContext(NotificationContext);
  const {enrollInCourse, addToWishlist} = useContext(CourseContext);
     const courseData = {
    // id: 'DA',
    name: 'Data Analysis',
    amount: '$45.00',
    time: '11 hours-20 lessons',
    image: require('../assets/dataAnal.jpg'),
    institution: 'IBM',
    tutor: 'Mosh Hamedeni',
    about: 'It is  asaying offlate that data is the new oil.',
    tutorBio: require('../assets/ibm.png')
  };

  const handleEnroll = () => {
    enrollInCourse(courseData);
    addNotification(`You enrolled in ${courseData.name}`);
    // navigation.navigate('Progress');
    navigation.navigate('Enroll', { newCourse: courseData });
  };

  const handleWish = () => {
    addToWishlist(courseData);
    addNotification(`You added ${courseData.name} to wishlist`);
    navigation.navigate('WishList');
  };
  

  return (
    <ScrollView style={styles.container}>
    
    <View >
        


    <View  >
                           <Image style={styles.courseImage} source={require('../assets/dataAnal.jpg')}></Image>
                           <View style={styles.tutorBioView}>
                               <Image source={require('../assets/ibm.png')} style={styles.tutorView}/>
                               <View>
                                <Text style={styles.tutorName}>Prog.Acqua Hayfron</Text>
                                <Text>Google</Text>
   
                               </View>
                           </View>
                           <Text style={styles.courseName}>Data Analysis</Text>
                           <Text style={styles.about}>Step into the world of Data Analysis and transform raw data into impactful business decisions.
                             At our institution, we’ll train you in top tools like Excel, SQL, Python, Power BI, and Tableau, using real-world datasets and hands-on projects.
                             Our expert-led tutorials prepare you for in-demand roles such as Data Analyst, Business Intelligence Analyst, Data Scientist, and Market Research Analyst across industries like finance, healthcare, tech, and e-commerce.
                             With career support and a portfolio of practical work, you’ll stand out in a job market that’s constantly seeking data-driven minds.
                             Enroll now and start building a future backed by data! </Text>
                           <View style={styles.amountView}>
                               <Text style={styles.amount}>$45.00</Text>
                               <Text style={styles.duration}>11 hours, 20 lessons</Text>
                           </View>
                           <TouchableOpacity style={styles.enroll} onPress={handleEnroll}>
                            <Text style={styles.enrollText}>Enroll now</Text>
                           </TouchableOpacity>
                           <TouchableOpacity style={styles.wish} onPress={handleWish}>
                            <Text style={styles.enrollText}>Add to wish List</Text>
                           </TouchableOpacity>
                       </View>
    </View>
        </ScrollView>
    
  )
}

export default DA

const styles = StyleSheet.create({
    container:{
        //justifyContent:'center',
       // alignItems:'center',
        marginTop:40, 
        //backgroundColor:'#e9f5f9',
       // marginBottom:50
       flex:1, 
       padding:5,
       flexGrow:1
      


    },
    enroll:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        backgroundColor:'green',
        borderRadius:11,
        marginBottom:10,
        marginTop:10

    },
    wish:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        backgroundColor:'#1e7898',
        borderRadius:11, 
        marginBottom:20

    },
    enrollText:{
        color:'white',
        fontWeight:'bold',
        fontSize:17

    },

     view1:{
        flexDirection:'row',
       // marginLeft:10,
        marginTop:20,
        backgroundColor:'white',
        height:70,
        borderRadius:10,
       // marginRight:10,
        paddingHorizontal:10,
        alignItems:'center',
        marginBottom:70,
         marginLeft:15,
       marginRight:15

    },
 tutorName:{
    fontWeight:'600',


 },
 courseName:{
    fontWeight:'bold',
    fontSize:20,
    paddingHorizontal:10,
    marginTop:5

 },
    courseImage:{
        height:250,
        width:'100%',
        borderRadius:12,
        marginBottom:30

    },
    tutorView:{
        height:50,
        width:50,
        borderRadius:30,
       // backgroundColor:'blue',
       marginRight:10,
       marginTop:2,
       marginBottom:20
    },
  about:{
    color:'grey',
    fontSize:15,
    paddingHorizontal:10,
    marginTop:15,
    marginBottom:10
  },
    inView1:{
        marginRight:20
    },
    inviewText1:{
        fontWeight:'bold',
        fontSize:18

    },
    amountView:{
        flexDirection:'row',
        paddingRight:10,
        paddingHorizontal:10,
        marginTop:10

    },
    amount:{
        fontSize:18,
        fontWeight:'bold',
        marginRight:130
    },
   duration:{
    color:'grey',

   },
    inviewText2:{
        fontWeight:'400',
        fontSize:14

    },

    bellIcons:{
        marginRight:50,
        marginLeft:70
    },
    tutorVieImage:{
        height:50,
        width:50,
        borderRadius:30,
        marginRight:10,
        marginTop:5
    },
    input:{
        backgroundColor:'white',
        borderRadius:12,
        borderEndWidth:1,
        borderColor:'grey',
        height:55,
        width:'90%',
         left:15,
        right:15,
        paddingHorizontal:20
    },
    catview:{
        flexDirection:'row',
        marginRight:20,
        height:40,
        width:100,
        backgroundColor:'#beeceb',
        borderRadius:12,
        justifyContent:'center',
        alignItems:'center',
        
    },
    view2:{
        flexDirection:'row',
        marginTop:40,
        marginLeft:20
    },
    view3:{
        marginTop:40,
        margin:20,
        marginBottom:30

    },
    courseView:{
        //height:150,
        width:'100%',
        marginBottom:20,
         backgroundColor:'white',
         height:300,
        borderRadius:12,



    

    },
    tutorBioView:{
        flexDirection:'row',
        paddingHorizontal:10,
        //justifyContent:'center',
        alignItems:'center'
    }
  
})