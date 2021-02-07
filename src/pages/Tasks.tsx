import React, { useState } from 'react';
import { IonAlert, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import Task from '../model/Task';
import TaskCard from '../components/TaskCard';
import TaskService from '../services/task-service';
import { add, bag, cart, hammer, barbell, walk, book, water } from 'ionicons/icons';
import useStore from '../hooks/use-store-hook';
import TaskItem from '../components/TaskItem';

const Tasks: React.FC = () => {

  const taskService = TaskService()
  const [tasks, setTasks] = useState<Task[]>()
  const [selectedTask, setSelectedTask] = useState<Task>()
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState<string | null>()
  const [taskIconInput, setTaskIconInput] = useState<string>(book)


  useStore(taskService, () => {
        taskService.list()
        .then(result => {
            setTasks(result)
        },
        err => console.log(err));
    }
  )

  const clearModal = () => {
    setSelectedTask(undefined)
    setTaskNameInput(null)
    setShowModal(false)
  }

  const addTask = async () => {
    if (!taskNameInput) {
      return
    }

    let task: Task | undefined = selectedTask
    if (!task) {
      task = {
        name: taskNameInput,
        icon: taskIconInput
      }
    }
    task.name = taskNameInput
    task.icon = taskIconInput

    await taskService.upsert(task)
    clearModal()
  }

  const deleteTask = async () => {
    
    if(selectedTask) {
      await taskService.delete(selectedTask)
    }
    
    clearModal()
  }

  let buttons
  if (selectedTask) {
    buttons = [<IonButton key="button-add" color="success" onClick={() => addTask()} expand="block">Update</IonButton>,
               <IonButton key="button-delete" color="danger" onClick={() => setShowAlert(true)} expand="block">Delete</IonButton>]
  } else {
    buttons = <IonButton color="success" onClick={() => addTask()} expand="block">Add</IonButton>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        {tasks?.map((task) => {
        return <TaskItem key={task.id} task={task} onPress={() => {
            setSelectedTask(task)
            setTaskNameInput(task.name)
            setShowModal(true)
          }}></TaskItem>
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="danger" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
         <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar color="success">
              <IonTitle>{selectedTask? 'Edit task' : 'Add a new task'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => 
                  clearModal()
                }>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={taskNameInput} required={true} onIonChange={e => setTaskNameInput(e.detail.value)}> </IonInput>
              </IonItem>
              <IonRadioGroup value={taskIconInput} onIonChange={e => setTaskIconInput(e.detail.value)}>
                <IonListHeader>
                  <IonLabel></IonLabel>
                </IonListHeader>

                <IonItem>
                  <IonLabel><IonIcon icon={book}/></IonLabel>
                  <IonRadio slot="end" value={book} />
                </IonItem>

                <IonItem>
                  <IonLabel><IonIcon icon={water}/></IonLabel>
                  <IonRadio slot="end" value={water} />
                </IonItem>
                <IonItem>
                  <IonLabel><IonIcon icon={bag}/></IonLabel>
                  <IonRadio slot="end" value={bag} />
                </IonItem>
                <IonItem>
                  <IonLabel><IonIcon icon={cart}/></IonLabel>
                  <IonRadio slot="end" value={cart} />
                </IonItem>
                <IonItem>
                  <IonLabel><IonIcon icon={hammer}/></IonLabel>
                  <IonRadio slot="end" value={hammer} />
                </IonItem>
                <IonItem>
                  <IonLabel><IonIcon icon={barbell}/></IonLabel>
                  <IonRadio slot="end" value={barbell} />
                </IonItem>
                <IonItem>
                  <IonLabel><IonIcon icon={walk}/></IonLabel>
                  <IonRadio slot="end" value={walk} />
                </IonItem>
              </IonRadioGroup>
            </IonList>
            {buttons}
              <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              cssClass='my-custom-class'
              header={'Delete Task'}
              message={'Do you really want to delete this task?'}
              buttons={[{
                text: "Nope",
                role: 'cancel'
              },
              {
                text: "Yes, please!",
                handler: () => {
                  if (selectedTask) {
                    deleteTask()
                  }
                }
              }]}
            />

          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
