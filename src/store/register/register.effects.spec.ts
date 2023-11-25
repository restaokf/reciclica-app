import { Observable, of, throwError } from "rxjs";
import { Action, StoreModule } from "@ngrx/store";
import { register, registerSuccess, registerFail } from "./register.actions";
import { TestBed } from "@angular/core/testing";
import { EffectsModule } from "@ngrx/effects";
import { provideMockActions } from '@ngrx/effects/testing'
import { AuthService } from "src/app/services/auth/auth.service";
import { User } from "src/app/model/user/User";
import { RegisterEffects } from "./register.effects";
import { UserRegister } from "src/app/model/user/UserRegister";

describe('Register effect', ()=> {
    let effects: RegisterEffects;
    let action$: Observable<Action>;
    let error = {error: 'error'};
    let user = new User();
    user.id = "anyUserId";

    let authServiceMock = {
        register(userRegister: UserRegister) {
            if (userRegister.email == "error@email.com") {
                return throwError(error);
            }
            return of({});
        }
    }
 
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot([]),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([
                    RegisterEffects
                ])
            ],
            providers: [
                provideMockActions(() => action$)
            ]
        }).overrideProvider(AuthService, {useValue: authServiceMock});

        effects = TestBed.get(RegisterEffects);
    })

    it('should register return success', (done) =>{
        action$ = of(register({userRegister: new UserRegister}));

        effects.register$.subscribe(newAction => {
            expect(newAction).toEqual(registerSuccess());
            done();
        });
    })

    it('should register return error', (done) =>{
        const userRegister = new UserRegister();
        userRegister.email = "error@email.com";
        
        action$ = of(register({userRegister: new UserRegister}));

        effects.register$.subscribe(newAction => {
            expect(newAction).toEqual(registerFail({error}));
            done();
        });
    })

    
})