import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSlide,
  IonSlides,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, trophy, settings } from 'ionicons/icons';
import Home from './pages/Home';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './pages/Tutorial.css'
import CompleteTask from './pages/CompleteTask';
import { init } from './services/database-service'
import SpendRewards from './pages/SpendRewards';
import Tasks from './pages/Tasks';
import InstaTask from './pages/InstaTask';
import ConfigService from './services/config-service'
import useStore from './hooks/use-store-hook';

init()


const App: React.FC = () => {
  
  const configService = ConfigService()
  const [tutorial, setTutorial] = useState(true)

  const dismissTutorial = () => {
    setTutorial(false)
    configService.upsert({id: 'tutorial', value: 'off'})
  }

  useStore(configService, () => {
    configService.get('tutorial')
    .then(config => {
      if (!config) {
        setTutorial(true)
      } else {
        setTutorial(config.value === 'on')
      }
    })
  })

  if (tutorial) {
  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };
    return (

    <IonApp>
        <IonContent fullscreen>
            <IonSlides pager={true} options={slideOpts}>
            <IonSlide>
                <h1>Setup your tasks</h1>
            </IonSlide>
            <IonSlide>
                <h1>Define some rewards for you</h1>
            </IonSlide>
            <IonSlide>
                <h1>Complete tasks and earn rewards</h1>
            </IonSlide>
            <IonSlide>
                <h1>Enjoy your rewards!</h1>
                <IonButton onClick={(e) => dismissTutorial()}>Start</IonButton>
            </IonSlide>
            </IonSlides>
        </IonContent>

    </IonApp>
    )
  }


  else return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/home/instatask" component={InstaTask} exact={true} />
          <Route path="/home/complete/:id" component={CompleteTask} exact={true} />
          <Route path="/settings" component={Settings} exact={true} />
          <Route path="/rewards" component={SpendRewards} exact={true} />
          <Route path="/settings/tasks" component={Tasks} exact={true} />
          <Route path="/settings/rewards" component={Rewards} exact={true} />
          <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" color="success">
          <IonTabButton tab="tab1" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/rewards">
            <IonIcon icon={trophy} />
            <IonLabel>Rewards</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)};

export default App;
