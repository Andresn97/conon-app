import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router';
import { CSSTransition } from 'react-transition-group';

import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '../../styles/flags/flags.css';

import { NavbarScreen } from '../shared/NavbarScreen';
import { SideNavigation } from '../shared/SideNavigation';
import { FooterScreen } from '../shared/FooterScreen';
import { AppConfig } from '../shared/AppConfig';
import { MethodologyStudentScreen } from '../student/MethodologyStudentScreen';
import { ToolMainScreen } from '../ui/tool/ToolMainScreen';
import { MessageScreen } from '../ui/message/MessageScreen';

export const StudentDashboardScreen = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if(mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    const menu = [
        {
            label: 'Inicio',
            items: [{
                label: 'Dashboard', icon: 'fas fa-home icon-primary', to: '/'
            }]
        },
        {
            label: 'Académico', icon: 'pi pi-fw pi-search',
            items: [
                {
                    label: 'Temas de Estudio', 
                    icon: 'fas fa-file-powerpoint icon-primary', 
                    to:'/topic'
                },
                {
                    label: 'Glosarios', 
                    icon: 'fas fa-spell-check icon-primary', 
                    to: '/glossary'
                },
                {
                    label: 'Comentarios', 
                    icon: 'fas fa-comment-alt icon-primary', 
                    to: '/empty'
                },
                {
                    label: 'Mensajes', 
                    icon: 'fas fa-envelope-open-text icon-primary', 
                    to: '/message'
                }
            ]
        },
    ];

    return (
        <div 
            className={wrapperClass} 
            onClick={onWrapperClick}
            // style={{backgroundColor:'#044360'}}
        >

            <NavbarScreen 
                onToggleMenuClick={onToggleMenuClick} 
                layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
            />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <SideNavigation model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route
                        exact
                        path="/"
                        component={MethodologyStudentScreen}
                    />
                    <Route
                        exact
                        path="/message"
                        component={MessageScreen}
                    />
                    {/* <Route
                        exact
                        path="/admin"
                        component={OwnerScreen}
                    />
                    <Route
                        exact
                        path="/student"
                        component={StudentScreen}
                    /> */}
                </div>
                <ToolMainScreen />
                <FooterScreen layoutColorMode={layoutColorMode}/>
            </div>

            <AppConfig 
                rippleEffect={ripple} 
                onRippleEffect={onRipple}  
                inputStyle={inputStyle} 
                onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} 
                onLayoutModeChange={onLayoutModeChange} 
                layoutColorMode={layoutColorMode} 
                onColorModeChange={onColorModeChange} 
            />

            <CSSTransition
                classNames="layout-mask" 
                timeout={{ enter: 200, exit: 200 }} 
                in={mobileMenuActive} 
                unmountOnExit
            >
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
            
        </div>
    )
}
