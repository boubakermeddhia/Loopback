import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {bcryptHash} from './services/hash.password'
import {userService} from './services/user-service'
import {JwtService} from './services/jwt-service'
import {Tokenservice, userserviceBinding, TokenServiceBinding, PasswordHasherBinding} from './keys'
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {jwtStrategy} from './authentication/auth'

export {ApplicationConfig};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up bindings
    this.setupBinding();
    // Set up the custom sequence
    this.component(AuthenticationComponent)
    registerAuthenticationStrategy(this, jwtStrategy)

    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setupBinding(): void {
    this.bind(PasswordHasherBinding.service_hasher).toClass(bcryptHash)
    this.bind(userserviceBinding.user_service).toClass(userService)
    this.bind(TokenServiceBinding.token_service).toClass(JwtService)
    this.bind(TokenServiceBinding.Token_secret).to(Tokenservice.TokenSecretValue)
    this.bind(TokenServiceBinding.token_expires_in).to(Tokenservice.TokenExpiresIn)
  }
}

