(function (module) {
    module.exports = function (Container, Window, Home) {
        return {
            setUp (finish) {
                this.container = new Container({
                    Date: Date
                });

                finish();
            },

            it_is_initializable (test) {
                test.ok(this.container instanceof Container);
                test.equal(Container.version, '2.0.0');

                test.done();
            },

            it_contains_default_objects (test) {
                test.ok(this.container.has('Date'));

                test.done();
            },

            it_adds_new_item_into_container (test) {
                this.container.bind('Window', Window, ['Date']);

                test.ok(this.container.has('Window'));

                test.done();
            },

            it_adds_new_item_into_container_with_function_argument (test) {
                var windowArguments = [
                    function () {
                        return new Date();
                    }
                ];

                this.container.bind('Window', Window, windowArguments);

                test.ok(this.container.has('Window'));

                test.done();
            },

            it_throws_exception_when_try_to_bind_element_with_invalid_definition_of_class (test) {
                test.throws(
                    function () {
                        this.container.bind('Window', new Window);
                    },
                    TypeError,
                    'Given `instance` does not seem like Class definition.'
                );

                test.done();
            },

            it_throws_exception_when_try_to_bind_already_exist_element (test) {
                test.throws(
                    () => {
                        this.container.bind('Date', Date)
                    },
                    Error,
                    'Element "Date" is already bound.'
                );

                test.done();
            },

            it_returns_instance_from_container (test) {
                this.container.bind('Window', Window, ['Date']);

                test.ok(this.container.get('Date') instanceof Date);
                test.ok(this.container.get('Window') instanceof Window);

                test.done();
            },

            it_returns_instance_from_container_with_custom_argument (test) {
                var windowArguments = [
                    () => {
                        return 'Date';
                    }
                ];

                this.container.bind('Window', Window, windowArguments);
                var windowElement = this.container.get('Window');

                test.ok(windowElement instanceof Window);
                test.strictEqual(windowElement.getDate(), 'Date');

                test.done();
            },

            it_returns_Window_instance_from_container_with_Date_parameter (test) {
                this.container.bind('Window', Window, ['Date']);

                var window_container = this.container.get('Window');

                test.ok(window_container instanceof Window);
                test.ok(window_container.getDate() instanceof Date);

                test.done();
            },

            it_returns_Home_instance_from_container_test_nesting (test) {
                this.container.bind('Window', Window, ['Date']);
                this.container.bind('Home', Home, ['Window']);

                var homeElement = this.container.get('Home');

                test.ok(homeElement instanceof Home);
                test.ok(homeElement.getWindow() instanceof Window);
                test.ok(homeElement.getWindow().getDate() instanceof Date);

                test.done();
            },

            it_throws_error_when_try_to_get_undefined_element_from_container (test) {
                test.throws(
                    () => {
                        this.container.get('Undefined Element')
                    },
                    Error,
                    'Element "Undefined Element" does not exist.'
                );

                test.done();
            },

            it_removes_existing_element_from_container (test) {
                this.container.remove('Date');

                test.strictEqual(this.container.has('Date'), false);

                test.done();
            },

            it_binds_singleton_based_on_instance_of_class (test) {
                this.container.remove('Date');
                this.container.singleton('Date', new Date());

                this.container.get('Date').setFullYear(2014);
                test.strictEqual(this.container.get('Date').getFullYear(), 2014);

                test.done();
            }
        };
    }
})(module);
