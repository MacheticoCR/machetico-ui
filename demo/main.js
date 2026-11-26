import '@angular/localize/init';
import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  Button,
  Card,
  Sidebar,
  Dialog,
  Slider,
  ImageSlider,
  Table,
  Select,
} from '../dist/machetico-ui/fesm2022/machetico-ui.mjs';
import template from './demo.html?raw';
import './styles.css';
class Playground {
  busy = signal(false);
  count = signal(0);
  sidebar = signal(false);
  dialog = signal(false);
  value = signal(30);
  theme = signal('folio');
  choice = signal('uno');
  options = [
    { value: 'uno', label: 'Primera opción' },
    { value: 'dos', label: 'Segunda opción' },
  ];
  rows = [
    { id: 1, name: 'Ejemplo A' },
    { id: 2, name: 'Ejemplo B' },
  ];
  columns = [{ key: 'name', label: 'Nombre', sortable: true, value: (row) => row.name }];
  sort = signal(null);
  key = (row) => row.id;
  slides = [
    {
      id: 'a',
      src:
        'data:image/svg+xml,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="lightblue"/></svg>',
        ),
      alt: 'Ejemplo azul',
      caption: 'Primera imagen',
    },
    {
      id: 'b',
      src:
        'data:image/svg+xml,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="lightgreen"/></svg>',
        ),
      alt: 'Ejemplo verde',
      caption: 'Segunda imagen',
    },
  ];
}
Component({
  selector: 'machetico-demo',
  imports: [Button, Card, Sidebar, Dialog, Slider, ImageSlider, Table, Select],
  template,
})(Playground);
bootstrapApplication(Playground).catch((error) => console.error(error));
