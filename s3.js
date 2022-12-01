controller ---------





import Task from '#model/task.js';
import Users from '#model/users.js';

const createTask = async (req, reply) => {
  try {
    let doctor,org_id,role_id,resource_id_resource , resource_id_sharing;
    const user = await Users.find({ doctor_id: req.body.doctor_id , akou_id: req.body.akou_id})
    user.map((ele) => {
      doctor = ele.doctor_id
      org_id = ele.akou_id
    })
    console.log(doctor,org_id)
    let collection = 'user_roles_rel';
    let query = `user_id=${doctor}`
    let url1 = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/${collection}?${query}`
    const headers = {
      "Authorization": "Bearer secret"
    }
    const result1 =  await call_api(url1,headers);
    result1.map((res=>{
      role_id = res.role_id 
    }))

    const url3 = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resources`
    const result3 =  await call_api(url3,headers);
    resource_id_resource = result3[result3.length-1].resource_id + 1
    console.log("for resources",resource_id_resource);

    // const url4 = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resource_sharing`
    // const result4 =  await call_api(url4,headers);
    // resource_id_sharing = result4[result4.length-1].resource_id + 1
    // console.log("for resources_sharing",resource_id_sharing )

    let header = req.headers;
    let method = 'post';

   let url = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resources` 
   await call_api(url,header,method,{text:req.body.text,status:req.body.status,resource_id:resource_id_resource,resource_type:req.body.type});

   let url2  = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resource_sharing`
   const result2 =  await call_api(url2,header,method,{resource_id:resource_id_resource,type:req.body.type,role_id:role_id,permission:req.body.permission,org_id:org_id,ak_id:doctor});
   console.log(result1)


    return reply.status(201).send({ message: 'Task created', data: result2 });
  } catch (err) {
    return reply.status(500).send({ message: `Error occur at ${err}` });
  }
}



const getAllTask = async (req, reply) => {
  try {
    const tasks = await Task.find({ doctor: req.params.doctor })

    return reply.status(200).send({ message: 'All Task Get By An Doctor', data: tasks });

  } catch (err) {
    return reply.status(500).send({ message: `Error occur at ${err}` });
  }
}


const updateAndCompleteTask = async (req, reply) => {
  try {
    let id, text, status, resource_type;
    let resource_id = req.params.resource_id
    const date = new Date(Date.now()).toISOString()
    console.log("ress_id", resource_id);
    if (resource_id) {
      let url = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resources?resource_id=${resource_id}`
      const headers = {
        "Authorization": "Bearer secret"
      }
      const result = await call_api(url, headers);
      result.map((ele) => {
        id = ele._id
        status = ele.status,
          resource_type = ele.resource_type
      })
      console.log("id", result)
      let method = 'put';
      let url1 = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resources/${id}`
      const result1 = await call_api(url1, headers, method, { text: req.body.text, status: status, resource_type: resource_type, resource_id: resource_id, created_at: date, updated_at: date });

      return reply.status(201).send({ message: 'Task updated', data: result1 });
    } 

  } catch (err) {
    return reply.status(500).send({ message: `Error occur at ${err}` });
  }
}


const deleteTask = async (req, reply) => {
  try {
    // let result;
    // const task = await Task.find({_id:req.params._id})
    // if (!task) {
    //   return reply.status(400).send({ message: `Task not find` });
    // }
    let resource_id = req.params.resource_id
    const url = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resources?resource_id=${resource_id}`
    const headers = {
      "Authorization": "Bearer secret"
    }
    let method = 'delete';
    const result =  await call_api(url,headers,method);


    const url1 = `http://akdevapp.duckdns.org:52203/api/v1/promsv2/resource_sharing?resource_id=${resource_id}`
    const result1 =  await call_api(url,headers,method);

    // task.map((ele)=>{
    //   result = ele
    // })
    // await result.remove()

    return reply.status(200).send({ message: 'Task deleted' });
  } catch (err) {
    return reply.status(500).send({ message: `Error occur at ${err}` });
  }
}





export { createTask, getAllTask, updateTask, deleteTask }










route --------------->


import { createTask ,getAllTask, updateTask,deleteTask} from '#controller/task.js';
// import {jwtToken} from '#middlewares/jwt_token.js'

export default async function (fastify, opts) {
  fastify.post('/api/v2/intcda/createtask', createTask );
  fastify.get('/api/v2/intcda/getalltask/:doctor', getAllTask );
  fastify.put('/api/v2/intcda/updatetask/:_id', updateTask );
  fastify.delete('/api/v2/intcda/deletetask/:_id', deleteTask );



}
























db.getCollection(‘users’).find({“akdc_id”: “AKPT000001"})
1:18
Doctor login url
1:18
http://akdevapp.duckdns.org:40001/doctor/login
1:18
Patient login
1:18
http://akdevapp.duckdns.org:40001/login
1:19
Doctor user
michael_jordan@gmail.com / Admin@123
1:19
Patient user
AKPT000001
1:22
Mongo DB
akdevapp.duckdns.org
51001

































//         let collection = collections.Resource_sharing;
//         let queryFilter = `ak_id=${ak_id}`
//         const result = await getDocument({collection,queryFilter})
//         result.document.map((ele)=>{
//             all_resource_id.push(ele.resource_id)
//             all_types.push(ele.type)
//         })
        
//         for(let i = 0 ; i<all_resource_id.length;i++){
//             collection = collections.Resource_sharing;
//             queryFilter = `ak_id=${ak_id}&resource_id=${all_resource_id[i]}`
//             const result1 = await getDocument({collection,queryFilter})
//             result1.document.map((res)=>{
//                 all_org_ids.push(res.org_id)
//             })
//         }
//         console.log(all_org_ids)
//         let result2;
// for(let i = 0; i<all_org_ids.length;i++){
//     collection = collections.User_organisations;
//     queryFilter = `akou_id=${all_org_ids[i]}`
//     result2 = await getDocument({collection,queryFilter})
//     initial_org_name =  crypto.decrypt(result2.document[0].org_name)

//     result2.document.map((ele)=>{
//         all_doctor_ids.push(ele.doctor_id)
        
//     })
// }        

// for(let i = 0; i<all_doctor_ids.length;i++){

//     initial_doctor_name = await AllDBServices.MemDBServices.getUser({ak_id: all_doctor_ids[i]})
//     initial_doctor_name = `Dr. ${initial_doctor_name.data.firstname} ${initial_doctor_name.data.lastname}`
//     console.log(initial_doctor_name)
// }


// for(let i = 0 ; i<all_types.length ; i++){
//     collection = collections.Resource_types
//     queryFilter = `type_id=${all_types[i]}`
//     let resource_type = await getDocument({collection,queryFilter})
//     initial_type_name = resource_type.document[0].name
// }


// data.push({
//     initial_org_name:initial_org_name,
//     initial_doctor_name:initial_doctor_name,
//     initial_type_name:initial_type_name
// })



























const patientVists = async (req, reply) => {
    let env = await hiddenData();
    const crypto = new AkunahEncryption(env.decryptKey);

    try {
        let data = [];
        let followup = [];
        let all_resource_id = [];
        let all_org_ids = []
        let all_doctor_ids = []
        let all_types = []
        let initial_org_name;
        let initial_type_name;
        let initial_doctor_name;
        let resource_id;
        let ak_id = req.params.ak_id
        

        let collection = collections.Resource_sharing;
        let queryFilter = `ak_id=${ak_id}`
        const result = await getDocument({collection,queryFilter})
        console.log("result.document",result.document.length)
        
        resource_id = result.document[0].resource_id

         collection = collections.Resources;
         queryFilter = `resource_id=${resource_id}`
        let response3 =  await getDocument({collection,queryFilter})
        // console.log(response3)
        if(response3.document[0].initial_assessment ===0 || !('initial_assessment' in response3.document[0])){

            collection = collections.User_organisations;
            queryFilter = `akou_id=${result.document[0].org_id}`
        //    if(result.document[i].org_id==null){
        //     break
        //    }

           let response1 = await getDocument({collection,queryFilter})
     

           
           result.document[0].org_name = crypto.decrypt(response1.document[0].org_name)
    
           
           collection = collections.Resource_sharing
           queryFilter = `resource_id=${result.document[0].resource_id}&ak_id__co=DC`
           let response2 = await getDocument({collection,queryFilter})

           let doctor_id = response2.document[0].ak_id
         





           let doctor_name = await AllDBServices.MemDBServices.getUser({ak_id: doctor_id})
         
           doctor_name = `Dr. ${doctor_name.data.firstname} ${doctor_name.data.lastname}`
         

           

         result.document[0].doctor_name  = doctor_name;

           collection = collections.Resource_types
           queryFilter = `type_id=${result.document[0].type}`
           let resource_type = await getDocument({collection,queryFilter})
           let type_name = resource_type.document[0].name
          


           result.document[0].type_name  = type_name
          

           data.push({
               organization_name:`${result.document[0].org_name}`,
               doctor_name:`${result.document[0].doctor_name}`,
               resource_type:`${result.document[0].type_name}`,
               resource_id:resource_id,
               createdAt:`${result.document[0].created_at}`,
               followup:followup
           })
           return reply.status(200).send({ message: `Patient Visits data : `, data:data });

        }

            let followups = {}
            followups.resource_id = []
            followups.resource_id.push(response3.document[0])
            console.log("response3.document[0]",followups.resource_id )
            let parent_resource_form_id = response3.document[0].parent_resource_form_id

        for(let i = 0; i < result.document.length; i++) {
          
            collection = collections.Resources
            queryFilter = `resource_id=${parent_resource_form_id}`

            let result4 = await getDocument({collection,queryFilter})
            followups.resource_id.push(result4.document[i])
            console.log("result4",result4)
            if(result4.document[i].initial_assessment===0 || !('initial_assessment' in result4.document[i])){ 
                break
            }else{
                parent_resource_form_id = result4.document[i].parent_resource_form_id
            }

        }
        



        reply.status(200).send({ message: `Patient Visits data : `, data:followups });

    } catch (error) {
        reply.status(500).send({ message: `Error occur at ${error.stack}` });
    }
};







































const patientVists = async (req, reply) => {
  let env = await hiddenData();
  const crypto = new AkunahEncryption(env.decryptKey);

  try {
      let data = [];
      let followup = [];
      let all_resource_id = [];
      let all_org_ids = []
      let all_doctor_ids = []
      let all_types = []
      let initial_org_name;
      let initial_type_name;
      let initial_doctor_name;
      let resource_id;
      let ak_id = req.params.ak_id
      
      let collection = collections.Resource_sharing;
      let queryFilter = `ak_id=${ak_id}`
      const result = await getDocument({collection,queryFilter})
      
      
  
      for(let i = 0; i < result.document.length; i++) {
          resource_id = result.document[i].resource_id

          let collection = collections.Resources;
          let queryFilter = `resource_id=${resource_id}`
          let response3 =  await getDocument({collection,queryFilter})

          if(response3.document[0].initial_assessment=== 1 || !('initial_assessment' in response3.document[0])){

              collection = collections.User_organisations;
              queryFilter = `akou_id=${result.document[i].org_id}`
             if(result.document[i].org_id==null){
              break
             }
 
             let response1 = await getDocument({collection,queryFilter})
       
 
             
             result.document[i].org_name = crypto.decrypt(response1.document[0].org_name)
            
 
 
             
             collection = collections.Resource_sharing
             queryFilter = `resource_id=${result.document[i].resource_id}&ak_id__co=DC`
             let response2 = await getDocument({collection,queryFilter})
 
             let doctor_id = response2.document[0].ak_id
            
 
 
 
 
 
             let doctor_name = await AllDBServices.MemDBServices.getUser({ak_id: doctor_id})
            
             doctor_name = `Dr. ${doctor_name.data.firstname} ${doctor_name.data.lastname}`
            
 
             
 
           result.document[i].doctor_name  = doctor_name;
 
             collection = collections.Resource_types
             queryFilter = `type_id=${result.document[i].type}`
             let resource_type = await getDocument({collection,queryFilter})
             let type_name = resource_type.document[0].name
            
 
 
             result.document[i].type_name  = type_name
             console.log("type_name", type_name)
 
             data.push({
                 organization_name:`${result.document[i].org_name}`,
                 doctor_name:`${result.document[i].doctor_name}`,
                 resource_type:`${result.document[i].type_name}`,
                 resource_id:resource_id,
                 createdAt:`${result.document[i].created_at}`,
                 followup:followup
             })
          }









          
      }
      



      reply.status(200).send({ message: `Patient Visits data : `, data:data });

  } catch (error) {
      reply.status(500).send({ message: `Error occur at ${error.stack}` });
  }
};






