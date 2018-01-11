import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CustomerPanel } from './components/CustomerPanel';
import { EditCustomerPanel } from './components/EditCustomerPanel';
import { ItemPanel } from './components/ItemPanel';

export const routes = <Layout>
    <Route exact path='/' component={CustomerPanel} />
    <Route path='/editCustomerPanel' component={EditCustomerPanel} />
    <Route path='/itemPanel' component={ItemPanel} />
</Layout>;
