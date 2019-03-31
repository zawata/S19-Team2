#include <boost/python.hpp>

#include "spyce_exceptions.hpp"
#include "spyce.hpp"

/**
 * Simplified exception declaration function
 **/
namespace py = boost::python;
template <class E> void exception_(const char *name) {
    //check that class type E inherits from SpyceException(to Ensure it has a `what` call)
    static_assert(std::is_base_of<SpyceException, E>::value, "Exception must inherit from Spyce Exception");

    //build Full Qualified Object Name underneath the current Module
    std::string full_name = std::string(py::extract<std::string>(py::scope().attr("__name__"))) + "." + name;

    //Declare a new Python Error that inherits from the `Exception Class` in python
    PyObject *exc = PyErr_NewException(full_name.c_str(), PyExc_Exception, 0);

    //give control of python exception class to Boost Python
    py::scope().attr(name) = py::handle<>(exc);

    //register the exception translator for the new exception class <template E>
    py::register_exception_translator<E>(
        //c++ lambda
        [exc=exc](E const&e){
            //throw a Python Exception with that same `what` data as the C++ Exception
            PyErr_SetString(exc, e.what().c_str());
        });
}

/**
 * Further simplified Exception Macro
 **/
#define exception(NAME) exception_<NAME ## Exception>(#NAME"Error")

BOOST_PYTHON_MODULE(spyce) {
    using namespace boost::python;

    /**
     * Initialization
     **/
    spyce_init();

    /**
     * Declarations
     **/
    exception(FileNotFound);
    exception(InvalidFile);
    exception(InvalidArgument);
    exception(Internal);
    exception(IDNotFound);
    exception(InsufficientData);

    def("str_to_id", &spyce_str_to_id);
    def("id_to_str", &spyce_id_to_str);

    def("utc_to_et", &spyce_utc_to_et);
    def("et_to_utc", &spyce_et_to_utc);

    def("add_kernel", &spyce_add_kernel);
    def("remove_kernel", &spyce_remove_kernel);

    def("get_objects", &spyce_get_objects);
    def("get_coverage_windows", &spyce_get_coverage_windows);

    def("get_frame_data", &spyce_get_frame_data);

    class_<Frame>("Frame")
        .def_readonly("x",  &Frame::x)
        .def_readonly("y",  &Frame::y)
        .def_readonly("z",  &Frame::z)
        .def_readonly("dx", &Frame::dx)
        .def_readonly("dy", &Frame::dy)
        .def_readonly("dz", &Frame::dz);
}
