'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">proyectofinal documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-d046f4f3ede06f606f3411e5ac8241affefab473f4d40341a0a8c24f2c501df150c2da1646d3c3aa789d34516cdf00c287220238df940c79f75cc361a588982e"' : 'data-bs-target="#xs-components-links-module-AppModule-d046f4f3ede06f606f3411e5ac8241affefab473f4d40341a0a8c24f2c501df150c2da1646d3c3aa789d34516cdf00c287220238df940c79f75cc361a588982e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d046f4f3ede06f606f3411e5ac8241affefab473f4d40341a0a8c24f2c501df150c2da1646d3c3aa789d34516cdf00c287220238df940c79f75cc361a588982e"' :
                                            'id="xs-components-links-module-AppModule-d046f4f3ede06f606f3411e5ac8241affefab473f4d40341a0a8c24f2c501df150c2da1646d3c3aa789d34516cdf00c287220238df940c79f75cc361a588982e"' }>
                                            <li class="link">
                                                <a href="components/App.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >App</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuditoriaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Busqueda.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Busqueda</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistorialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Login.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Login</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Main.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Main</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Mapa.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Mapa</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Nav.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Nav</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Perfil.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Perfil</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Principal.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Principal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Registro.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Registro</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuarioCrud.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuarioCrud</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuditoriaService.html" data-type="entity-link" >AuditoriaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AvionService.html" data-type="entity-link" >AvionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClimaService.html" data-type="entity-link" >ClimaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HistorialService.html" data-type="entity-link" >HistorialService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtService.html" data-type="entity-link" >JwtService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link" >UsuarioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AircraftDTO.html" data-type="entity-link" >AircraftDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AirlineDTO.html" data-type="entity-link" >AirlineDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArrivalDTO.html" data-type="entity-link" >ArrivalDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Auditoria.html" data-type="entity-link" >Auditoria</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Avion.html" data-type="entity-link" >Avion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Clima.html" data-type="entity-link" >Clima</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DepartureDTO.html" data-type="entity-link" >DepartureDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightDTO.html" data-type="entity-link" >FlightDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographyDTO.html" data-type="entity-link" >GeographyDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Historial.html" data-type="entity-link" >Historial</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Nube.html" data-type="entity-link" >Nube</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpeedDTO.html" data-type="entity-link" >SpeedDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenJwt.html" data-type="entity-link" >TokenJwt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario.html" data-type="entity-link" >Usuario</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});