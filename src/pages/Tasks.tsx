import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Task from '../model/Task';
import TaskCard from '../components/TaskCard';
import TaskService from '../services/task-service';
import { add, trophy } from 'ionicons/icons';

const Tasks: React.FC = () => {

  const taskService = TaskService()
  const [tasks, setTasks] = useState<Task[]>()
  const [showModal, setShowModal] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState<string | null>()


  useEffect(() => {
    const getTasks = () => {
        taskService.list()
        .then(result => {
            setTasks(result)
        },
        err => console.log(err));
    }
    const handler = () => getTasks()
    taskService.on('item:added', handler)
    
    getTasks()

    return () => {
      taskService.off('item:added', handler)
    }
  }, [])

  const addTask = async () => {
    if (!taskNameInput) {
      return
    }
    const task: Task = {
      name: taskNameInput,
      icon: trophy
    }
    await taskService.add(task)
    setTaskNameInput(null)
    setShowModal(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        {tasks?.map((task) => {
          return <TaskCard key={task.id} task={task} onPress={() => {
          }}></TaskCard>
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
         <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add a Task</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={taskNameInput} required={true} onIonChange={e => setTaskNameInput(e.detail.value)}> </IonInput>
              </IonItem>
            </IonList>
            <IonButton onClick={() => addTask()} expand="block">Add</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
