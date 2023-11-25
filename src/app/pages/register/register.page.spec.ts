import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store'
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterPageModule } from './register.module';
import { AppState } from 'src/store/AppState';
import { loadingReducer } from 'src/store/loading/loading.reducer';
import { registerReducer } from 'src/store/register/register.reducers';
import { register, registerFail, registerSuccess } from 'src/store/register/register.actions';
import { UserRegister } from 'src/app/model/user/UserRegister';
import { loginReducer } from 'src/store/login/login.reducer';
import { Geolocation } from '@capacitor/geolocation';
import { of } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let router: Router;
  let page: any;
  let store: Store<AppState>;
  let toastController: ToastController

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports :  [
        IonicModule.forRoot(),
        AppRoutingModule, 
        ReactiveFormsModule,
        RegisterPageModule,
        StoreModule.forRoot([]),
        StoreModule.forFeature("loading", loadingReducer),
        StoreModule.forFeature("login", loginReducer),
        StoreModule.forFeature("register", registerReducer)
      ]
    })
    /*.overrideProvider(Geolocation, {useValue: new GeolocationMock()})
    .overrideProvider(LocationService, {useValue: new LocationServiceMock()})*/
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    toastController = TestBed.get(ToastController);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }));

  it('should create register on page init', () => {
    fixture.detectChanges();

    expect(component.registerForm).not.toBeUndefined();
  })

  it('should not be allowed be register with form invalid', () => {
    fixture.detectChanges();

    spyOn (router, 'navigate');

    clickOnRegisterButton();

    store.select("register").subscribe(state => {
      expect(state.isRegistering).toBeFalsy();
    })
  })

  it('given form is valid, when user clicks on register, then register', () => {
    fixture.detectChanges();

    failForm();

    clickOnRegisterButton();

    store.select("register").subscribe(state => {
      expect(state.isRegistering).toBeTruthy();
    })

  })

  it('given form is valid, when user clicks on register, then show loading', () => {
    fixture.detectChanges();

    failForm();

    clickOnRegisterButton();
    
    store.select("loading").subscribe(state => {
      expect(state.show).toBeTruthy();
    })

  })

  it('given page init, when geolocation is enabled, then fill address detaiils with user location', fakeAsync(() => {
    fixture.detectChanges();

    tick(10);

    expect(component.registerForm.getForm().value.address).toEqual({
      street: 'geocoded_street',
      number: 'geocoded_number',
      neighborhood: 'geocoded_neighborhood',
      zipcode: 'geocoded_zipcode',
      complement: '',
      state: 'geocoded_state',
      city: 'geocoded_city'
    })
  }))

  it('should hide loading component when registration successful', () => {
    fixture.detectChanges();

    store.dispatch(register({userRegister : new UserRegister()}));
    store.dispatch(registerSuccess());

    store.select('loading').subscribe(state => {
      expect(state.show).toBeFalsy();
    })
  })

  it('should login when registration successful', () => {
    fixture.detectChanges();

    spyOn(router, 'navigate');

    store.dispatch(register({userRegister : new UserRegister()}));
    store.dispatch(registerSuccess());

    store.select('login').subscribe(state =>  {
      expect(state.isLogginIn).toBeTruthy()
    });
  })

  it('should hide loading component when registration fails', () => {
    fixture.detectChanges();

    store.dispatch(register({userRegister : new UserRegister()}));
    store.dispatch(registerFail({error: {message: 'any message'}}));

    store.select('loading').subscribe(state => {
      expect(state.show).toBeFalsy();
    })
  })

  it('should show error when registration fails', () => {
    fixture.detectChanges();

    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () =>{}}));

    store.dispatch(register({userRegister : new UserRegister()}));
    store.dispatch(registerFail({error: {message: 'any message'}}));

    expect(router.navigate).toHaveBeenCalled();
  })


  function clickOnRegisterButton() {
    page.querySelector('ion-button').click();
  }

  function failForm() {
    component.registerForm.getForm().get('name')?.setValue("anyName");
    component.registerForm.getForm().get('email')?.setValue("any@email.com");
    component.registerForm.getForm().get('password')?.setValue("anyPassword");
    component.registerForm.getForm().get('repeatPassword')?.setValue("anyPassword");
    component.registerForm.getForm().get('phone')?.setValue("anyPhone");
    component.registerForm.getForm().get('address')?.get('street')?.setValue("any street");
    component.registerForm.getForm().get('address')?.get('number')?.setValue("any number");
    component.registerForm.getForm().get('address')?.get('complemet')?.setValue("any complement");
    component.registerForm.getForm().get('address')?.get('neighborhood')?.setValue("any neighborhood");
    component.registerForm.getForm().get('address')?.get('zipcode')?.setValue("any zipcode");
    component.registerForm.getForm().get('address')?.get('city')?.setValue("any city");
    component.registerForm.getForm().get('address')?.get('state')?.setValue("any state");

  }

  /*class GeolocationMock {
    getCurrentPosition() {
      return Promise.resolve({
        coords: {
          latitude: 1,
          longitude: 2
        }
      })
    }
  }

  class LocationServiceMock {
    geocode(location: any) {
      return of({
        address_component: [
          {long_name: "geocoded_street", types: ["route"]},
          {long_name: "geocoded_number", types: ["street_number"]},
          {long_name: "geocoded_neighboorhood", types: ["sublocality"]},
          {long_name: "geocoded_zipcode", types: ["postal_code"]},
          {long_name: "geocoded_state", types: ["administrative_area_lavel_1"]},
          {long_name: "geocoded_street", types: ["administrative_area_lavel_2"]},
        ]
      })
    }
  }*/
});
