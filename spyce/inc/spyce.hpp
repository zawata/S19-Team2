#pragma once

#include <boost/python.hpp>

#include "SpiceUsr.h"

struct Frame {
    double x,y,z,dx,dy,dz;

    Frame(SpiceDouble *frame);
    Frame();
};

namespace py = boost::python;
struct spyce {
    std::string file;

    spyce();

    static int str_to_id(std::string naif_id);

    //get and set for file.
    void _set_file(std::string s);
    std::string _get_file();

    void add_kernel(std::string s);
    void remove_kernel(std::string s);

    py::list get_objects();

    Frame get_frame_data(int target_id, int observer_id, double e_time);
};