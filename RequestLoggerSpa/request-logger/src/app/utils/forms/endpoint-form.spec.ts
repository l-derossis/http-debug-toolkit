import { FormArray, FormControl } from '@angular/forms';
import { EndpointForm } from './endpoint-form';

fdescribe('EndpointForm', () => {
  let form: EndpointForm;

  beforeEach(() => {
    form = new EndpointForm();
  });

  it('should create', () => {
    expect(form).toBeTruthy();

    expect(form.get(EndpointForm.routeControlName)).toBeInstanceOf(FormControl);
    expect(form.get(EndpointForm.methodControlName)).toBeInstanceOf(
      FormControl
    );
  });

  it('should create statusCode control', () => {
    form.addStatusCodeControl();

    const control = form.get(EndpointForm.statusCodeControlName);

    expect(control).toBeInstanceOf(FormControl);
  });

  it('should create body control', () => {
    form.addBodyControl();

    const control = form.get(EndpointForm.bodyControlName);

    expect(control).toBeInstanceOf(FormControl);
  });

  it('should create headers control', () => {
    form.addHeadersControl();

    const control = form.get(EndpointForm.headersControlName);

    expect(control).toBeInstanceOf(FormArray);
  });

  it('should get headers control', () => {
    form.addControl(EndpointForm.headersControlName, new FormArray([]));

    const headers = form.headersControl;

    expect(headers).toBeInstanceOf(FormArray);
  });

  it('should set headers', () => {
    const headers = new Map<string, string>();
    headers.set('key1', 'value1');
    headers.set('key2', 'value2');

    form.headers = headers;

    const retrievedHeaders = form.headersControl;
    expect(retrievedHeaders.controls.length).toBe(3);
    // We expect 3 because we always create an empty one at the end for the user input
  });

  it('should set headers (already existing values)', () => {
    const previousHeaders = new Map<string, string>();
    previousHeaders.set('previousKey1', 'previousValue1');
    previousHeaders.set('previousKey2', 'previousValue2');
    form.headers = previousHeaders;

    const newHeaders = new Map<string, string>();
    newHeaders.set('newKey1', 'newValue1');
    newHeaders.set('newKey2', 'newValue2');
    form.headers = newHeaders;

    const retrievedHeaders = form.headersControl;
    expect(retrievedHeaders.controls.length).toBe(3);
    expect(retrievedHeaders.controls[0].get('key')?.value).toBe('newKey1');
    expect(retrievedHeaders.controls[1].get('value')?.value).toBe('newValue2');
  });

  it('should set headers value (empty map)', () => {
    const headers = new Map<string, string>();

    form.headers = headers;

    const retrievedHeaders = form.headersControl;
    expect(retrievedHeaders.controls.length).toBe(1);
  });

  it('should add headers', () => {
    form.addHeader('key', 'value');

    const retrievedHeaders = form.headersControl;
    expect(retrievedHeaders.controls.length).toBe(2);
    expect(retrievedHeaders.controls[0].get('key')?.value).toBe('key');
  });
});
